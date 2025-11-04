import prisma from "../configs/prisma.config";
import { DriverResponse } from "../responses/driver.response";
import {
  createSchema,
  updateSchema,
  getSchema,
  deleteSchema,
} from "../schemas/driver.schema";
import {
  isCreateRest,
  isGetRest,
  isDeleteRest,
  isPutRest,
} from "../utils/rest.util";
import { hashPassword } from "../utils/bcypt.util";
import AccountService from "./account.service";
import FirebaseService from "./firebase.service";

const DriverService = {
  async get(input: any) {
    const data = getSchema.parse(input);
    const driver = await prisma.drivers.findUnique({
      where: {
        id: data.id,
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
      status: driver.status,
    } as DriverResponse);
  },

  async getList() {
    const drivers = await prisma.drivers.findMany({
      include: {
        account: true,
      },
    });
    return isGetRest(
      drivers.map((driver) => ({
        id: driver.id,
        avatar: driver.avatar,
        full_name: driver.full_name,
        birth_date: driver.birth_date,
        gender: driver.gender,
        phone: driver.phone,
        email: driver.email,
        address: driver.address,
        account_id: driver.account_id,
        username: driver.account?.username,
        status: driver.account?.status as "ACTIVE" | "INACTIVE",
      }))
    );
  },

  async create(input: any, file?: Express.Multer.File) {
    try {
      // console.log("hello");
      const data = createSchema.parse(input);
      // console.log("hello4");
      if (!data.username || !data.password) {
        throw new Error("Username hoặc password không hợp lệ");
      }

      const hashedPassword = await hashPassword(data.password);
      const account = await prisma.accounts.create({
        data: {
          username: data.username,
          password: hashedPassword,
          role: "DRIVER",
          status: data.status ?? "ACTIVE",
        },
      });

      const driver = await prisma.drivers.create({
        data: {
          avatar: data.avatar,
          full_name: data.full_name,
          gender: data.gender,
          birth_date: new Date(data.birth_date),
          email: data.email,
          phone: data.phone,
          address: data.address,
          status: data.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
          account: { connect: { id: account.id } },
        },
      });

      return isCreateRest({
        id: driver.id,
        avatar: driver.avatar,
        full_name: driver.full_name,
        gender: driver.gender,
        birth_date: driver.birth_date,
        email: driver.email,
        phone: driver.phone,
        address: driver.address,
        status: driver.status,
      } as DriverResponse);
    } catch (error) {
      console.error(" Create driver error:", error);
      throw error;
    }
  },

  async update(input: any) {
    try {
      // console.log("hello");
      const data = updateSchema.parse(input);
      const updateDriver: any = {};
      console.log("hello2");
      console.log("Payload parse qua Zod:", data);
      console.log("Data thực tế gửi vào Prisma:", updateDriver);

      if (data.avatar) {
        updateDriver.avatar = data.avatar;
      }

      if (data.full_name) {
        updateDriver.full_name = data.full_name;
      }

      if (data.birth_date) {
        updateDriver.birth_date = data.birth_date;
      }

      if (data.gender) {
        updateDriver.gender = data.gender;
      }

      if (data.email) {
        updateDriver.email = data.email;
      }

      if (data.phone) {
        updateDriver.phone = data.phone;
      }
      if (data.address) {
        updateDriver.address = data.address;
      }

      if (data.status) {
        updateDriver.status = data.status;
      }

      const driver = await prisma.drivers.update({
        where: {
          id: data.id,
        },
        data: updateDriver,
      });

      if (driver.account_id && (data.password || data.status)) {
        await AccountService.update({
          id: driver.account_id,
          password: data.password,
          status: data.status,
        });
      }
      // console.log("hello3");

      return isPutRest({
        id: driver.id,
        avatar: driver.avatar,
        full_name: driver.full_name,
        gender: driver.gender,
        birth_date: driver.birth_date,
        email: driver.email,
        phone: driver.phone,
        address: driver.address,
        status: driver.status,
      } as DriverResponse);
    } catch (error) {
      console.error(" Update driver error:", error);
      throw error;
    }
  },

  async uploadAvatar(id: number, file: Express.Multer.File) {
    const avatarUrl = await FirebaseService.uploadDriverImage(
      file as unknown as File
    );
    await prisma.drivers.update({
      where: { id },
      data: { avatar: avatarUrl },
    });

    return isPutRest({ id, avatar: avatarUrl });
  },

  async deleteDriver(input: any) {
    const data = deleteSchema.parse(input);
    const driver = await prisma.drivers.delete({
      where: {
        id: data.id,
      },
    });

    return isDeleteRest({
      id: driver.id,
      avatar: driver.avatar,
      full_name: driver.full_name,
      gender: driver.gender,
      birth_date: driver.birth_date,
      email: driver.email,
      phone: driver.phone,
      address: driver.address,
      status: driver.status,
    } as DriverResponse);
  },
};

export default DriverService;
