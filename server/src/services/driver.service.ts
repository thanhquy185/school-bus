import { AccountStatus, ActiveStatus, ScheduleStatus } from "@prisma/client";
import prisma from "../configs/prisma.config";
import { AuthenticationPayload } from "../middlewares/auth.middleware";
import { ActiveResponse } from "../responses/active.response";
import { DriverResponse } from "../responses/driver.response";
import { ScheduleResponse } from "../responses/schedule.response";
import { createSchema, updateSchema } from "../schemas/driver.schema";
import { hashPassword } from "../utils/bcypt.util";
import { verifyToken } from "../utils/jwt.util";
import { isCreateRest, isGetRest, isPutRest } from "../utils/rest.util";
import AccountService from "./account.service";
import FirebaseService from "./firebase.service";

const DriverService = {
  async getByAccount(authorization: string) {
    const payload: AuthenticationPayload = await verifyToken(authorization);

    const driver = await prisma.drivers.findUnique({
      where: {
        account_id: payload.id,
      },

      include: {
        account: {
          select: {
            username: true,
          },
        },
      },
    });

    return isGetRest({
      id: driver.id,
      avatar: driver.avatar,
      full_name: driver.full_name,
      birth_date: driver.birth_date,
      gender: driver.gender,
      phone: driver.phone,
      email: driver.email,
      address: driver.address,
      account_id: driver.account_id,
      username: driver.account.username,
    });
  },

  async getAll() {
    const drivers = await prisma.drivers.findMany({
      include: {
        account: true,
      },
    });

    return isGetRest(
      drivers.map(
        (driver) =>
          ({
            id: driver.id,
            avatar: driver.avatar,
            full_name: driver.full_name,
            birth_date: driver.birth_date,
            gender: driver.gender,
            phone: driver.phone,
            email: driver.email,
            address: driver.address,
            status: driver.account.status,
            account_id: driver.account.id,
            username: driver.account.username,
          } as DriverResponse)
      )
    );
  },

  async getAllActive() {
    const drivers = await prisma.drivers.findMany({
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
      drivers.map(
        (driver) =>
          ({
            id: driver.id,
            avatar: driver.avatar,
            full_name: driver.full_name,
            birth_date: driver.birth_date,
            gender: driver.gender,
            phone: driver.phone,
            email: driver.email,
            address: driver.address,
            status: driver.account.status,
            account_id: driver.account.id,
            username: driver.account.username,
          } as DriverResponse)
      )
    );
  },

  async uploadAvatar(id: number, file: Express.Multer.File) {
    const avatarUrl = await FirebaseService.uploadDriverImage(
      file as unknown as File
    );
    await prisma.drivers.update({
      where: { id },
      data: { avatar: avatarUrl },
    });

    return isCreateRest({ id, avatar: avatarUrl });
  },

  async create(input: any) {
    const data = createSchema.parse(input);

    const account = await prisma.accounts.create({
      data: {
        username: data.username,
        password: await hashPassword(data.password),
        role: "DRIVER",
        status: data.status,
      },
    });

    const driver = await prisma.drivers.create({
      data: {
        full_name: data.full_name,
        birth_date: data.birth_date,
        gender: data.gender,
        phone: data.phone,
        email: data.email ?? null,
        address: data.address ?? null,
        account: {
          connect: { id: account.id },
        },
      },
      include: {
        account: true,
      },
    });

    return isCreateRest({
      id: driver.id,
      avatar: driver.avatar,
      full_name: driver.full_name,
      birth_date: driver.birth_date,
      gender: driver.gender,
      phone: driver.phone,
      email: driver.email,
      address: driver.address,
      status: driver.account.status,
      account_id: driver.account.id,
      username: driver.account.username,
    } as DriverResponse);
  },

  async update(input: any) {
    const data = updateSchema.parse(input);

    const driverSelected = await prisma.drivers.findUnique({
      where: {
        id: data.id,
      },
    });
    if (!driverSelected) {
      throw new Error("Tài xế không tồn tại !");
    }
    if (data.status === "INACTIVE") {
      const activeSchedule = await prisma.schedules.findFirst({
        where: {
          driver_id: data.id,
          status: "ACTIVE",
        },
      });

      if (activeSchedule) {
        throw new Error(
          `Không thể khoá tài xế này vì có lịch trình #${activeSchedule.id} hoạt động đang sử dụng !`
        );
      }
    }

    const updateData: any = {};
    if (data.full_name) {
      updateData.full_name = data.full_name;
    }
    if (data.birth_date) {
      updateData.birth_date = data.birth_date;
    }
    if (data.gender) {
      updateData.gender = data.gender;
    }
    if (data.phone) {
      updateData.phone = data.phone;
    }
    if (data.email) {
      updateData.email = data.email;
    }
    if (data.address) {
      updateData.address = data.address;
    }

    const driverUpdate = await prisma.drivers.update({
      where: {
        id: data.id,
      },
      data: updateData,
      include: {
        account: true,
      },
    });

    if (driverUpdate.account_id && (data.password || data.status)) {
      await AccountService.update({
        id: driverUpdate.account_id,
        password: data.password,
        status: data.status,
      });
    }

    return isPutRest({
      id: driverUpdate.id,
      avatar: driverUpdate.avatar,
      full_name: driverUpdate.full_name,
      birth_date: driverUpdate.birth_date,
      gender: driverUpdate.gender,
      phone: driverUpdate.phone,
      email: driverUpdate.email,
      address: driverUpdate.address,
      status: driverUpdate.account.status,
      account_id: driverUpdate.account.id,
      username: driverUpdate.account.username,
    } as DriverResponse);
  },

  async getActive(authentication: string) {
    const payload: AuthenticationPayload = await verifyToken(authentication);

    const active = await prisma.actives.findFirst({
      where: {
        status: ActiveStatus.ACTIVE,
        schedule: {
          driver: {
            account_id: payload.id,
          },
        },
      },
      include: {
        schedule: {
          include: {
            route: true,
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
    if (!active) return isGetRest(null);

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
        },
      },
      start_at: active.start_at,
      end_at: active.end_at,
      bus_lat: active.bus_lat,
      bus_lng: active.bus_lng,
      bus_speed: active.bus_speed,
      bus_status: active.bus_status,
      status: active.status,
      active_pickups: active.active_pickups.map((ap) => ({
        pickup: ap.pickup,
        order: ap.order,
        at: ap.at,
        status: ap.status,
      })),
      active_students: active.active_students.map((as) => ({
        student: as.student,
        at: as.at,
        status: as.status,
      })),
      informs: active.informs.map((inform) => ({
        id: inform.id,
        at: inform.at,
        type: inform.type,
        message: inform.message,
        description: inform.description,
      })),
    } as ActiveResponse);
  },

  async getActiveForSchedule(authentication: string) {
    const payload: AuthenticationPayload = await verifyToken(authentication);

    const active = await prisma.actives.findFirst({
      where: {
        status: ActiveStatus.ACTIVE,
        schedule: {
          driver: {
            account_id: payload.id,
          },
        },
      },
      include: {
        schedule: true,
      },
    });
    if (!active) return isGetRest(null);

    return isGetRest({
      id: active.id,
      schedule: {
        id: active.schedule.id,
      },
    } as ActiveResponse);
  },

  async getSchedules(authentication: string) {
    const payload: AuthenticationPayload = await verifyToken(authentication);

    const schedules = await prisma.schedules.findMany({
      where: {
        driver: {
          account_id: payload.id,
        },
        status: ScheduleStatus.ACTIVE,
      },
      include: {
        route: true,
        bus: true,
        actives: {
          orderBy: { start_at: "desc" },
        },
      },
    });

    const response: ScheduleResponse[] = schedules.map((schedule) => ({
      id: schedule.id,
      route: schedule.route,
      bus: schedule.bus,
      start_date: schedule.start_date,
      end_date: schedule.end_date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      days_of_week: schedule.days_of_week,
      status: schedule.status,
      actives: schedule.actives.map((active) => ({
        id: active.id,
        start_at: active.start_at,
        end_at: active.end_at,
        bus_lat: active.bus_lat,
        bus_lng: active.bus_lng,
        bus_speed: active.bus_speed,
        bus_status: active.bus_status,
        status: active.status,
      })),
    }));

    return isGetRest(response);
  },

  async getInfo(authentication: string) {
    const payload: AuthenticationPayload = await verifyToken(authentication);

    const driver = await prisma.drivers.findUnique({
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
      avatar: driver.avatar,
      username: driver.account.username,
      id: driver.id,
      full_name: driver.full_name,
      birth_date: driver.birth_date,
      gender: driver.gender,
      phone: driver.phone,
      email: driver.email,
      address: driver.address,
      account_id: driver.account_id,
      status: driver.account.status,
    } as DriverResponse);
  },
};

export default DriverService;
