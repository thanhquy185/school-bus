import { BusStatus } from "@prisma/client";
import prisma from "../configs/prisma.config";
import { BusResponse } from "../responses/bus.respone";
import { createSchema, updateSchema } from "../schemas/bus.schema";
import { isCreateRest, isGetRest, isPutRest } from "../utils/rest.util";

const BusService = {
  async getAll() {
    const buses = await prisma.buses.findMany();
    return isGetRest(buses);
  },

  async getAllActive() {
    const buses = await prisma.buses.findMany({
      where: {
        status: BusStatus.ACTIVE,
      },
    });

    return isGetRest(buses);
  },

  async create(input: any) {
    const data = createSchema.parse(input);
    const buses = await prisma.buses.create({
      data: {
        license_plate: data.license_plate,
        capacity: data.capacity,
        status: data.status,
      },
    });

    return isCreateRest({
      id: buses.id,
      license_plate: buses.license_plate,
      capacity: buses.capacity,
      status: buses.status,
    } as BusResponse);
  },

  async update(input: any) {
    const data = updateSchema.parse(input);

    const busSelected = await prisma.buses.findUnique({
      where: {
        id: data.id,
      },
    });
    if (!busSelected) {
      throw new Error("Xe buýt không tồn tại !");
    }
    if (data.status === "INACTIVE") {
      const activeSchedule = await prisma.schedules.findFirst({
        where: {
          bus_id: data.id,
          status: "ACTIVE",
        },
      });

      if (activeSchedule) {
        throw new Error(
          `Không thể khoá xe buýt này vì có lịch trình #${activeSchedule.id} hoạt động đang sử dụng !`
        );
      }
    }

    const updateData: any = {};
    if (data.license_plate) {
      updateData.license_plate = data.license_plate;
    }
    if (data.capacity) {
      updateData.capacity = data.capacity;
    }
    if (data.status) {
      updateData.status = data.status;
    }

    const busUpdate = await prisma.buses.update({
      where: {
        id: data.id,
      },
      data: updateData,
    });

    return isPutRest({
      id: busUpdate.id,
      license_plate: busUpdate.license_plate,
      capacity: busUpdate.capacity,
      status: busUpdate.status,
    } as BusResponse);
  },
};

export default BusService;
