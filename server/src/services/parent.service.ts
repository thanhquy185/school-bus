import prisma from "../configs/prisma.config";
import { ParentResponse } from "../responses/parent.response";
import {
  createSchema,
  deleteSchema,
  getSchema,
  updateSchema,
} from "../schemas/parent.schema";
import {
  isCreateRest,
  isDeleteRest,
  isGetRest,
  isPutRest,
} from "../utils/rest.util";
import AccountService from "./account.service";
import { hashPassword } from "../utils/bcypt.util";
import FirebaseService from "./firebase.service";
import { AuthenticationPayload } from "../middlewares/auth.middleware";
import { verifyToken } from "../utils/jwt.util";
import { StudentResponse } from "../responses/student.response";
import { AccountStatus, ActiveStatus } from "@prisma/client";
import { ActiveResponse } from "../responses/active.response";

const ParentService = {
  async get(input: any) {
    const data = getSchema.parse(input);
    const parent = await prisma.parents.findUnique({
      where: {
        id: data.id,
      },
    });

    return isGetRest({
      id: parent.id,
      full_name: parent.full_name,
      phone: parent.phone,
      email: parent.email,
      address: parent.address,
      account_id: parent.account_id,
    } as ParentResponse);
  },

  async getAll() {
    const parents = await prisma.parents.findMany({
      include: {
        account: true,
      },
    });

    return isGetRest(
      parents.map((parent) => ({
        id: parent.id,
        avatar: parent.avatar,
        full_name: parent.full_name,
        phone: parent.phone,
        email: parent.email ?? null,
        address: parent.address ?? null,
        account_id: parent.account_id,
        username: parent.account?.username,
        status: parent.account?.status as "ACTIVE" | "INACTIVE",
      }))
    );
  },

  async getAllActive() {
    const parents = await prisma.parents.findMany({
      include: {
        account: true,
      },
      where: {
        account: {
          status: AccountStatus.ACTIVE,
        },
      },
    });

    return isGetRest(
      parents.map((parent) => ({
        id: parent.id,
        avatar: parent.avatar,
        full_name: parent.full_name,
        phone: parent.phone,
        email: parent.email ?? null,
        address: parent.address ?? null,
        account_id: parent.account_id,
        username: parent.account?.username,
        status: parent.account?.status as "ACTIVE" | "INACTIVE",
      }))
    );
  },

  async uploadAvatar(id: number, file: Express.Multer.File) {
    const avatarUrl = await FirebaseService.uploadParentImage(
      file as unknown as File
    );
    await prisma.parents.update({
      where: { id },
      data: { avatar: avatarUrl },
    });

    return isPutRest({ id, avatar: avatarUrl });
  },

  async create(input: any, file?: Express.Multer.File) {
    const data = createSchema.parse(input);
    const account = await prisma.accounts.create({
      data: {
        username: data.username,
        password: await hashPassword(data.password),
        role: "PARENT",
        status: data.status,
      },
    });

    const parent = await prisma.parents.create({
      data: {
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        avatar: file ? file.filename : null,
        account: {
          connect: { id: account.id },
        },
      },
    });

    return isCreateRest({
      id: parent.id,
      full_name: parent.full_name,
      phone: parent.phone,
      email: parent.email ?? null,
      address: parent.address ?? null,
      account_id: parent.account_id,
    } as ParentResponse);
  },

  async update(input: any) {
    const data = updateSchema.parse(input);

    const parentSelected = await prisma.parents.findUnique({
      where: {
        id: data.id,
      },
    });
    if (!parentSelected) {
      throw new Error("Phụ huynh không tồn tại !");
    }
    if (data.status === "INACTIVE") {
      const activeSchedule = await prisma.students.findFirst({
        where: {
          parent_id: data.id,
          status: "STUDYING",
        },
      });

      if (activeSchedule) {
        throw new Error(
          "Không thể khoá phụ huynh này vì có học sinh còn đi học đang sử dụng !"
        );
      }
    }

    const updateData: any = {};
    if (data.full_name) {
      updateData.full_name = data.full_name;
    }
    if (data.email || data.email === "") {
      updateData.email = data.email;
    }
    if (data.address || data.address === "") {
      updateData.address = data.address;
    }
    if (data.phone) {
      updateData.phone = data.phone;
    }

    const parent = await prisma.parents.update({
      where: {
        id: data.id,
      },
      data: updateData,
    });
    if (parent.account_id && (data.password || data.status)) {
      await AccountService.update({
        id: parent.account_id,
        password: data.password,
        status: data.status,
      });
    }

    return isPutRest({
      id: parent.id,
      full_name: parent.full_name,
      email: parent.email ?? null,
      address: parent.address ?? null,
      phone: parent.phone,
    });
  },

  async getActiveByStudent(authentication: string, student_id: number) {
    const payload: AuthenticationPayload = await verifyToken(authentication);

    const student = await prisma.students.findFirst({
      where: {
        id: student_id,
        parent_id: payload.id,
      },
    });
    if (!student) throw new Error("Học sinh này không tồn tại");

    const active = await prisma.actives.findFirst({
      where: {
        status: ActiveStatus.ACTIVE,
        active_students: {
          some: {
            student_id: student_id,
          },
        },
      },
      include: {
        schedule: {
          include: {
            route: {
              include: {
                routePickups: {
                  include: {
                    pickup: true,
                  },
                },
              },
            },
            bus: true,
            driver: true,
          },
        },
        active_pickups: { include: { pickup: true } },
        active_students: {
          include: {
            student: {
              include: {
                parent: true,
                class: true,
                pickup: true,
              },
            },
          },
        },
        informs: true,
      },
    });
    if (!active)
      throw new Error("Không có hành trình đưa đón cho học sinh này");

    return isGetRest({
      id: active.id,
      schedule: {
        id: active.schedule.id,
        start_date: active.schedule.start_date,
        end_date: active.schedule.end_date,
        start_time: active.schedule.start_time,
        end_time: active.schedule.end_time,
        days_of_week: active.schedule.days_of_week,
        route: {
          id: active.schedule.route.id,
          name: active.schedule.route.name,
          start_pickup: active.schedule.route.start_pickup,
          end_pickup: active.schedule.route.end_pickup,
          routePickups: active.schedule.route.routePickups.map((rp) => ({
            pickup: {
              id: rp.pickup.id,
              name: rp.pickup.name,
              category: rp.pickup.category,
              lat: rp.pickup.lat,
              lng: rp.pickup.lng,
              status: rp.pickup.status,
            },
            order: rp.order,
          })),
        },
        bus: {
          id: active.schedule.bus.id,
          license_plate: active.schedule.bus.license_plate,
          capacity: active.schedule.bus.capacity,
        },
        driver: {
          id: active.schedule.driver.id,
          avatar: active.schedule.driver.avatar,
          full_name: active.schedule.driver.full_name,
          birth_date: active.schedule.driver.birth_date,
          gender: active.schedule.driver.gender,
          phone: active.schedule.driver.phone,
        },
      },
      start_at: active.start_at,
      end_at: active.end_at,
      bus_lat: active.bus_lat,
      bus_lng: active.bus_lng,
      bus_speed: active.bus_speed,
      bus_status: active.bus_status,
      status: active.status,
      // active_pickups: active.active_pickups.map((ap) => ({
      //   pickup: ap.pickup,
      //   order: ap.order,
      //   at: ap.at,
      //   status: ap.status,
      // })),
      // active_students: active.active_students.map((as) => ({
      //   student: as.student,
      //   at: as.at,
      //   status: as.status,
      // })),
      informs: active.informs.map((i) => ({
        id: i.id,
        at: i.at,
        type: i.type,
        message: i.message,
        description: i.description,
      })),
      current_active_student: active.active_students?.find(
        (active_student) => student.id === active_student.student_id
      ),
    } as ActiveResponse);
  },

  async getStudents(authentication: string) {
    const payload: AuthenticationPayload = await verifyToken(authentication);

    const account = await prisma.accounts.findUnique({
      where: {
        username: payload.username,
      },
      include: {
        parents: {
          include: {
            students: {
              include: {
                parent: true,
                class: true,
                pickup: true,
              },
            },
          },
        },
      },
    });

    return isGetRest(
      account.parents.students
        .filter((student) => student.status === "STUDYING")
        .map(
          (student) =>
            ({
              id: student.id,
              avatar: student.avatar,
              card_id: student.card_id,
              full_name: student.full_name,
              birth_date: student.birth_date,
              gender: student.gender,
              address: student.address,
              status: student.status,
              parent: {
                id: student.parent.id,
                full_name: student.parent.full_name,
              },
              class: {
                id: student.class.id,
                name: student.class.name,
              },
              pickup: {
                id: student.pickup.id,
                name: student.pickup.name,
                category: student.pickup.category,
                lat: student.pickup.lat,
                lng: student.pickup.lng,
              },
            } as unknown as StudentResponse)
        )
    );
  },

  async getInfo(authentication: string) {
    const payload: AuthenticationPayload = await verifyToken(authentication);

    const parent = await prisma.parents.findUnique({
      where: {
        account_id: payload.id,
      },
      include: {
        account: {
          select: {
            username: true,
            status: true,
          },
        },
      },
    });

    return isGetRest({
      avatar: parent.avatar,
      username: parent.account.username,
      id: parent.id,
      full_name: parent.full_name,
      phone: parent.phone,
      email: parent.email,
      address: parent.address,
      account_id: parent.account_id,
      status: parent.account.status,
    } as ParentResponse);
  },
};

export default ParentService;
