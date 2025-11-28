import { PickupStatus } from "@prisma/client";
import prisma from "../configs/prisma.config";
import { PickupResponse } from "../responses/pickup.response";
import {
  createSchema,
  deleteSchema,
  getSchema,
  updateSchema,
} from "../schemas/pickup.schema";
import {
  isCreateRest,
  isDeleteRest,
  isGetRest,
  isPutRest,
} from "../utils/rest.util";

const PickupService = {
  async get(input: any) {
    const data = getSchema.parse(input);
    const pickup = await prisma.pickups.findUnique({
      where: {
        id: data.id,
      },
    });

    return isGetRest(pickup);
  },

  async getAll() {
    const pickups = await prisma.pickups.findMany();

    return isGetRest(pickups);
  },

  async getAllActive() {
    const pickups = await prisma.pickups.findMany({
      where: {
        status: PickupStatus.ACTIVE,
      },
    });

    return isGetRest(pickups);
  },

  async create(input: any) {
    const data = createSchema.parse(input);
    const pickup = await prisma.pickups.create({
      data: {
        name: data.name,
        category: data.category,
        lat: data.lat,
        lng: data.lng,
        status: data.status,
      },
    });

    return isCreateRest({
      id: pickup.id,
      name: pickup.name,
      category: pickup.category,
      lat: pickup.lat,
      lng: pickup.lng,
      status: pickup.status,
    } as PickupResponse);
  },

  async update(input: any) {
    const data = updateSchema.parse(input);

    const pickupSelected = await prisma.pickups.findUnique({
      where: {
        id: data.id,
      },
    });
    if (!pickupSelected) {
      throw new Error("trạm xe buýt không tồn tại !");
    }
    if (data.status === "INACTIVE") {
        const activeRoute = await prisma.route_pickups.findFirst({
          where: {
            pickup_id: data.id,
            route: {
              status: "ACTIVE",
            },
          },
          include: { route: true },
        });
        if (activeRoute) {
          throw new Error(
            `Không thể khóa trạm xe buýt này vì đang nằm trong tuyến đường #${activeRoute.route?.id} đang hoạt động!`
          );
        }

      const activeStudent = await prisma.students.findFirst({
        where: {
          pickup_id: data.id,
          status: "STUDYING",
        },
      });
      if (activeStudent) {
        throw new Error(
          `Không thể khoá trạm xe buýt này vì có học sinh #${activeStudent.id} còn đi học đang sử dụng!`
        );
      }
    }

    const updateData: any = {};
    if (data.name) {
      updateData.name = data.name;
    }
    if (data.category) {
      updateData.category = data.category;
    }
    if (data.lat) {
      updateData.lat = data.lat;
    }
    if (data.lng) {
      updateData.lng = data.lng;
    }
    if (data.status) {
      updateData.status = data.status;
    }

    const pickup = await prisma.pickups.update({
      where: {
        id: data.id,
      },
      data: updateData,
    });

    return isPutRest({
      id: pickup.id,
      name: pickup.name,
      category: pickup.category,
      lat: pickup.lat,
      lng: pickup.lng,
      status: pickup.status,
    } as PickupResponse);
  },

  async delete(input: any) {
    const data = deleteSchema.parse(input);

    const pickup = await prisma.pickups.delete({
      where: {
        id: data.id,
      },
    });

    return isDeleteRest({
      id: pickup.id,
      name: pickup.name,
      category: pickup.category,
      lat: pickup.lat,
      lng: pickup.lng,
      status: pickup.status,
    } as PickupResponse);
  },
};

export default PickupService;
