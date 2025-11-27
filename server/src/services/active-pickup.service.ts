import prisma from "../configs/prisma.config";
import { ActivePickupResponse } from "../responses/active-pickup.response";
import {
  createSchema,
  deleteSchema,
  updateSchema,
} from "../schemas/active-pickup.schema";
import {
  isCreateRest,
  isDeleteRest,
  isGetRest,
  isPutRest,
} from "../utils/rest.util";

const ActivePickupService = {
  async getAll() {
    const activePickups = await prisma.active_pickups.findMany({
      include: {
        pickup: true,
      },
    });

    return isGetRest(
      activePickups.map(
        (activePickup) =>
          ({
            active_id: activePickup.active_id,
            pickup_id: activePickup.pickup_id,
            pickup: activePickup.pickup,
            order: activePickup.order,
            at: activePickup.at,
            status: activePickup.status,
          } as ActivePickupResponse)
      )
    );
  },

  async create(input: any) {
    const data = createSchema.parse(input);

    const activePickup = await prisma.active_pickups.create({
      data: {
        order: data.order,
        at: data.at,
        status: data.status,

        active: {
          connect: { id: data.active_id },
        },
        pickup: {
          connect: { id: data.pickup_id },
        },
      },
    });

    return isCreateRest({
      active_id: activePickup.active_id,
      pickup_id: activePickup.pickup_id,
      order: activePickup.order,
      at: activePickup.at,
      status: activePickup.status,
    } as ActivePickupResponse);
  },

  async update(input: any) {
    const data = updateSchema.parse(input);

    const updateData: any = {};
    if (data.active_id) {
      updateData.active_id = data.active_id;
    }
    if (data.pickup_id) {
      updateData.pickup_id = data.pickup_id;
    }
    if (data.order) {
      updateData.order = data.order;
    }
    if (data.at) {
      updateData.at = data.at;
    }
    if (data.status) {
      updateData.status = data.status;
    }
    const activePickup = await prisma.active_pickups.update({
      where: {
        active_id_pickup_id: {
          active_id: data.active_id,
          pickup_id: data.pickup_id,
        },
      },
      data: updateData,
      include: {
        active: true,
      },
    });

    return isPutRest({
      active_id: activePickup.active_id,
      pickup_id: activePickup.pickup_id,
      order: activePickup.order,
      at: activePickup.at,
      status: activePickup.status,
    } as ActivePickupResponse);
  },

  async delete(input: any) {
    const data = deleteSchema.parse(input);

    const activePickup = await prisma.active_pickups.delete({
      where: {
        active_id_pickup_id: {
          active_id: data.active_id,
          pickup_id: data.pickup_id,
        },
      },
      include: {
        active: true,
      },
    });

    return isDeleteRest({
      active_id: activePickup.active_id,
      pickup_id: activePickup.pickup_id,
      order: activePickup.order,
      at: activePickup.at,
      status: activePickup.status,
    } as ActivePickupResponse);
  },
};

export default ActivePickupService;
