import prisma from "../configs/prisma.config";
import { InformResponse } from "../responses/inform.response";
import {
  createSchema,
  deleteSchema,
  getSchema,
  updateSchema,
} from "../schemas/inform.schema";
import {
  isCreateRest,
  isDeleteRest,
  isGetRest,
  isPutRest,
} from "../utils/rest.util";

const InformService = {
  async getById(input: any) {
    const data = getSchema.parse(input);
    const inform = await prisma.informs.findUnique({
      include: {
        active: {
          include: {
            schedule: {
              include: {
                route: true,
                bus: true,
                driver: true,
              },
            },
          },
        },
      },
      where: {
        id: data.id,
      },
    });

    return isGetRest({
      id: inform.id,
      at: inform.at,
      type: inform.type,
      message: inform.message,
      description: inform.description,

      route: {
        id: inform.active.schedule.route.id,
        name: inform.active.schedule.route.name,
      },
      bus: {
        id: inform.active.schedule.bus.id,
        license_plate: inform.active.schedule.bus.license_plate,
      },
      driver: {
        id: inform.active.schedule.driver.id,
        full_name: inform.active.schedule.driver.full_name,
      },
    } as InformResponse);
  },

  async getAll() {
    const informs = await prisma.informs.findMany({
      include: {
        active: {
          include: {
            schedule: {
              include: {
                route: {
                  include: {
                    routePickups: {
                      orderBy: { order: "asc" },
                      include: { pickup: true },
                    },
                  },
                },
                bus: true,
                driver: true,
              },
            },
          },
        },
      },
    });

    return isGetRest(
      informs.map(
        (inform) =>
          ({
            id: inform.id,
            at: inform.at,
            type: inform.type,
            message: inform.message,
            description: inform.description,

            route: {
              id: inform.active.schedule.route.id,
              name: inform.active.schedule.route.name,
              routePickups: inform.active.schedule.route.routePickups.map(
                (rp) => ({
                  pickup: {
                    id: rp.pickup.id,
                    name: rp.pickup.name,
                    category: rp.pickup.category,
                    lat: rp.pickup.lat,
                    lng: rp.pickup.lng,
                    status: rp.pickup.status,
                  },
                  order: rp.order,
                })
              ),
            },
            bus: {
              id: inform.active.schedule.bus.id,
              license_plate: inform.active.schedule.bus.license_plate,
            },
            driver: {
              id: inform.active.schedule.driver.id,
              full_name: inform.active.schedule.driver.full_name,
            },
          } as InformResponse)
      )
    );
  },

  async create(input: any) {
    const data = createSchema.parse(input);
    const inform = await prisma.informs.create({
      data: {
        at: data.at,
        type: data.type,
        message: data.message,
        description: data.description,

        active: {
          connect: { id: data.active_id },
        },
      },
      include: {
        active: true,
      },
    });

    return isCreateRest({
      id: inform.id,
      active: inform.active,
      at: inform.at,
      type: inform.type,
      message: inform.message,
      description: inform.description,
    } as InformResponse);
  },

  async update(input: any) {
    const data = updateSchema.parse(input);

    const updateData: any = {};
    if (data.active_id) {
      updateData.active_id = data.active_id;
    }
    if (data.at) {
      updateData.at = data.at;
    }
    if (data.type) {
      updateData.type = data.type;
    }
    if (data.message) {
      updateData.message = data.message;
    }
    if (data.description) {
      updateData.description = data.description;
    }
    const inform = await prisma.informs.update({
      where: {
        id: data.id,
      },
      data: updateData,
      include: {
        active: true,
      },
    });

    return isPutRest({
      id: inform.id,
      active: inform.active,
      at: inform.at,
      type: inform.type,
      message: inform.message,
      description: inform.description,
    } as InformResponse);
  },

  async delete(input: any) {
    const data = deleteSchema.parse(input);

    const inform = await prisma.informs.delete({
      where: {
        id: data.id,
      },
      include: {
        active: true,
      },
    });

    return isDeleteRest({
      id: inform.id,
      active: inform.active,
      at: inform.at,
      type: inform.type,
      message: inform.message,
      description: inform.description,
    } as InformResponse);
  },
};

export default InformService;
