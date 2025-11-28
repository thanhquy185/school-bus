import prisma from "../configs/prisma.config";
import { AuthenticationPayload } from "../middlewares/auth.middleware";
import { DriverResponse } from "../responses/driver.response";
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
          status: "ACTIVE",
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
        full_name: data.fullName,
        birth_date: data.birthDate,
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
          `Không thể khoá tài xế này vì có lịch làm việc #${activeSchedule.id} hoạt động đang sử dụng !`
        );
      }
    }

    const updateData: any = {};
    if (data.fullName) {
      updateData.full_name = data.fullName;
    }
    if (data.birthDate) {
      updateData.birth_date = data.birthDate;
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
        schedule: {
          include: {
            route: true,
            bus: true
          }
        }
      },
    });

    /**
     *   id         Int            @id @default(autoincrement())
        start_date String
        end_date   String
        start_time String
        end_time   String
        status     ScheduleStatus @default(ACTIVE)

        driver_id Int
        driver    drivers @relation(fields: [driver_id], references: [id])

        bus_id Int
        bus    buses @relation(fields: [bus_id], references: [id])

        route_id Int
        route    routes @relation(fields: [route_id], references: [id])
     */

    // const driverInfo = {
    //   id: driver.id,
    //   name: driver.full_name,
    //   avatar: driver.avatar,
    //   route: driver.schedule.map(sc => ({
    //     id: sc.route.id,
    //     name: sc.route.name,
        
    //   }))
    //       bus: driver.schedule?.bus ?? null,
    // };}

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
