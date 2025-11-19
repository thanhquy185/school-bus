import prisma from "../configs/prisma.config";
import {
  createSchema,
  updateSchema,
  deleteSchema,
  getSchema,
} from "../schemas/route.schema";
import {
  isCreateRest,
  isDeleteRest,
  isGetRest,
  isPutRest,
} from "../utils/rest.util";
import { RouteResponse } from "../responses/route.response";

const RouteService = {
  // Lấy 1 tuyến đường
  async get(input: any) {
    const data = getSchema.parse(input);

    const route = await prisma.routes.findUnique({
      where: { id: data.id },
      include: {
        pickups: {
          orderBy: { order: "asc" },
          include: { pickup: true },
        },
      },
    });

    if (!route) throw new Error("Route not found");

    const response: RouteResponse = {
      id: route.id,
      name: route.name,
      startPickup: route.start_pickup,
      endPickup: route.end_pickup,
      totalDistance: route.total_distance,
      totalTime: route.total_time,
      status: route.status,
      pickups: route.pickups.map((rp) => ({
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
    };

    return isGetRest(response);
  },

  // Lấy tất cả tuyến đường
  async getAll() {
    const routes = await prisma.routes.findMany({
      include: {
        pickups: {
          orderBy: { order: "asc" },
          include: { pickup: true },
        },
      },
    });

    const response = routes.map((route) => ({
      id: route.id,
      name: route.name,
      startPickup: route.start_pickup,
      endPickup: route.end_pickup,
      totalDistance: route.total_distance,
      totalTime: route.total_time,
      status: route.status,
      pickups: route.pickups.map((rp) => ({
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
    }));

    return isGetRest(response);
  },

  async getAllActive() {
    const routes = await prisma.routes.findMany({
      include: {
        pickups: {
          orderBy: { order: "asc" },
          include: { pickup: true },
        },
      },
      where: {
        status: "ACTIVE",
      },
    });

    const response = routes.map((route) => ({
      id: route.id,
      name: route.name,
      startPickup: route.start_pickup,
      endPickup: route.end_pickup,
      totalDistance: route.total_distance,
      totalTime: route.total_time,
      status: route.status,
      pickups: route.pickups.map((rp) => ({
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
    }));

    return isGetRest(response);
  },

  // Tạo tuyến đường
  async create(input: any) {
    const data = createSchema.parse(input);

    const route = await prisma.routes.create({
      data: {
        name: data.name,
        start_pickup: data.startPickup,
        end_pickup: data.endPickup,
        total_distance: data.totalDistance,
        total_time: data.totalTime,
        status: data.status,
        pickups: {
          create: data.pickups.map((p: any) => ({
            pickup_id: p.pickupId,
            order: p.order,
          })),
        },
      },
      include: {
        pickups: { include: { pickup: true }, orderBy: { order: "asc" } },
      },
    });

    const response: RouteResponse = {
      id: route.id,
      name: route.name,
      startPickup: route.start_pickup,
      endPickup: route.end_pickup,
      totalDistance: route.total_distance,
      totalTime: route.total_time,
      status: route.status,
      pickups: route.pickups.map((rp) => ({
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
    };

    return isCreateRest(response);
  },

  // Cập nhật tuyến đường
  async update(input: any) {
    const data = updateSchema.parse(input);

    const routeSelected = await prisma.routes.findUnique({
      where: {
        id: data.id,
      },
    });
    if (!routeSelected) {
      throw new Error("Tuyến đường không tồn tại !");
    }
    if (data.status === "INACTIVE") {
      const activeSchedule = await prisma.schedules.findFirst({
        where: {
          route_id: data.id,
          status: "ACTIVE",
        },
      });

      if (activeSchedule) {
        throw new Error(
          `Không thể khoá tuyến đường này vì có lịch làm việc #${activeSchedule.id} hoạt động đang sử dụng !`
        );
      }
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.startPickup) updateData.start_pickup = data.startPickup;
    if (data.endPickup) updateData.end_pickup = data.endPickup;
    if (data.totalDistance !== undefined)
      updateData.total_distance = data.totalDistance;
    if (data.totalTime !== undefined) updateData.total_time = data.totalTime;
    if (data.status) updateData.status = data.status;

    // Nếu người dùng muốn cập nhật pickups
    if (data.pickups) {
      // Xóa pickup cũ, tạo mới (cách dễ nhất)
      await prisma.routePickups.deleteMany({
        where: { route_id: data.id },
      });

      updateData.pickups = {
        create: data.pickups.map((p: any) => ({
          pickup_id: p.pickupId,
          order: p.order,
        })),
      };
    }

    const route = await prisma.routes.update({
      where: { id: data.id },
      data: updateData,
      include: {
        pickups: { include: { pickup: true }, orderBy: { order: "asc" } },
      },
    });

    const response: RouteResponse = {
      id: route.id,
      name: route.name,
      startPickup: route.start_pickup,
      endPickup: route.end_pickup,
      totalDistance: route.total_distance,
      totalTime: route.total_time,
      status: route.status,
      pickups: route.pickups.map((rp) => ({
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
    };

    return isPutRest(response);
  },

  // Xóa tuyến đường
  async delete(input: any) {
    const data = deleteSchema.parse(input);

    const route = await prisma.routes.delete({
      where: { id: data.id },
      include: {
        pickups: { include: { pickup: true }, orderBy: { order: "asc" } },
      },
    });

    const response: RouteResponse = {
      id: route.id,
      name: route.name,
      startPickup: route.start_pickup,
      endPickup: route.end_pickup,
      totalDistance: route.total_distance,
      totalTime: route.total_time,
      status: route.status,
      pickups: route.pickups.map((rp) => ({
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
    };

    return isDeleteRest(response);
  },
};

export default RouteService;
