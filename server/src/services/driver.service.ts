import prisma from "../configs/prisma.config";
import { DriverResponse } from "../responses/driver.response";
import {
  createDriverSchema,
  updateDriverSchema,
  getDriverSchema,
  deleteDriverSchema,
} from "../schemas/driver.schema";
import {
  isCreateRest,
  isGetRest,
  isDeleteRest,
  isPutRest,
} from "../utils/rest.util";

const DriverService = {
  async getDriver(input: any) {
    const data = getDriverSchema.parse(input);
    const driver = await prisma.drivers.findUnique({
      where: {
        id: data.id,
      },
    });

    return isGetRest({
      id: driver.id,
      avatar: driver.avatar,
      fullname: driver.name,
      birth_date: driver.birth_date,
      gender: driver.gender,
      phone: driver.phone,
      email: driver.email,
      address: driver.address,
      status: driver.status,
    } as DriverResponse);
  },

  async getAllDrivers() {
    const drivers = await prisma.drivers.findMany();
    return isGetRest(drivers);
  },

  async createDriver(input: any) {
    const data = createDriverSchema.parse(input);
    const driver = await prisma.drivers.create({
      data: {
        avatar: data.avatar,
        fullname: data.fullname,
        gender: data.gender,
        birth_date: data.birth_date,
        email: data.email,
        phone: data.phone,
        address: data.address,
        status: data.status,
      },
    });

    return isCreateRest({
      id: driver.id,
      avatar: driver.avatar,
      fullname: driver.fullname,
      gender: driver.gender,
      birth_date: driver.birth_date,
      email: driver.email,
      phone: driver.phone,
      address: driver.address,
      status: driver.status,
    } as DriverResponse);
  },

  async updateDriver(input: any) {
    const data = updateDriverSchema.parse(input);
    const updateDriver: any = {};

    if (data.avatar) {
      updateDriver.avatar = data.avatar;
    }

    if (data.fullname) {
      updateDriver.fullname = data.fullname;
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

    if (data.status) {
      updateDriver.status = data.status;
    }

    const driver = await prisma.drivers.update({
      where: {
        id: data.id,
      },
      data: updateDriver,
    });

    return isPutRest({
      id: driver.id,
      avatar: driver.avatar,
      fullname: driver.fullname,
      gender: driver.gender,
      birth_date: driver.birth_date,
      email: driver.email,
      phone: driver.phone,
      address: driver.address,
      status: driver.status,
    } as DriverResponse);
  },

  async deleteDriver(input: any) {
    const data = deleteDriverSchema.parse(input);
    const driver = await prisma.drivers.delete({
      where: {
        id: data.id,
      },
    });

    return isDeleteRest({
      id: driver.id,
      avatar: driver.avatar,
      fullname: driver.fullname,
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
