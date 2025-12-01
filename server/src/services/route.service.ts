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
import { RouteStatus } from "@prisma/client";

const RouteService = {
  // Lấy 1 tuyến đường
  async get(input: any) {
    const data = getSchema.parse(input);

    const route = await prisma.routes.findUnique({
      where: { id: data.id },
      include: {
        routePickups: {
          orderBy: { order: "asc" },
          include: { pickup: true },
        },
      },
    });

    if (!route) throw new Error("Route not found");

    const response: RouteResponse = {
      id: route.id,
      name: route.name,
      start_pickup: route.start_pickup,
      end_pickup: route.end_pickup,
      total_distance: route.total_distance,
      total_time: route.total_time,
      status: route.status,
      routePickups: route.routePickups.map((rp) => ({
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
        routePickups: {
          orderBy: { order: "asc" },
          include: { pickup: true },
        },
      },
    });

    const response = routes.map((route) => ({
      id: route.id,
      name: route.name,
      start_pickup: route.start_pickup,
      end_pickup: route.end_pickup,
      total_distance: route.total_distance,
      total_time: route.total_time,
      status: route.status,
      routePickups: route.routePickups.map((rp) => ({
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
        routePickups: {
          orderBy: { order: "asc" },
          include: { pickup: true },
        },
      },
      where: {
        status: RouteStatus.ACTIVE,
      },
    });

    const response = routes.map((route) => ({
      id: route.id,
      name: route.name,
      start_pickup: route.start_pickup,
      end_pickup: route.end_pickup,
      total_distance: route.total_distance,
      total_time: route.total_time,
      status: route.status,
      routePickups: route.routePickups.map((rp) => ({
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
  try {
    // 1️⃣ Normalize payload (snake_case -> camelCase)
    const normalized = {
      name: input.name,
      start_pickup: String(input.start_pickup), // DB đang là string
      end_pickup: String(input.end_pickup),
      total_distance: Number(input.total_distance) || 0,
      total_time: Number(input.total_time) || 0,
      status: input.status,
      routePickups: (input.route_pickups || []).map((p: any) => ({
        pickup_id: Number(p.pickup_id),
        order: Number(p.order),
      })),
    };

    // 2️⃣ Validate với Zod
    const data = createSchema.parse(normalized);

    console.log("Normalized & validated data:", data);

    // 3️⃣ Tạo route với Prisma
    const route = await prisma.routes.create({
      data: {
        name: data.name,
        start_pickup: data.start_pickup,
        end_pickup: data.end_pickup,
        total_distance: data.total_distance,
        total_time: data.total_time,
        status: data.status,
        routePickups: {
          create: data.routePickups.map((p) => ({
            pickup_id: p.pickup_id,
            order: p.order,
          })),
        },
      },
      include: {
        routePickups: { include: { pickup: true }, orderBy: { order: "asc" } },
      },
    });

    // 4️⃣ Format response
    const response: RouteResponse = {
      id: route.id,
      name: route.name,
      start_pickup: route.start_pickup,
      end_pickup: route.end_pickup,
      total_distance: route.total_distance,
      total_time: route.total_time,
      status: route.status,
      routePickups: route.routePickups.map((rp) => ({
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
  } catch (err: any) {
    console.error("Create route failed:", err);
    // Trả về lỗi rõ ràng cho FE
    throw new Error(err?.message || "Create route failed");
  }
},


// Cập nhật tuyến đường
async update(input: any) {
  console.log("🚀 Input from frontend:", input);

  // Map frontend payload 'pickups' => 'routePickups' nếu có
  const inputForValidation = {
    ...input,
    routePickups: input.routePickups?.map((p: any) => ({
      pickup_id: p.pickupId, // chuyển từ pickupId sang pickup_id
      order: p.order,
    })),
  };

  console.log("🚀 Input for validation (routePickups mapped):", inputForValidation);

  // Validate bằng Zod
  const data = updateSchema.parse(inputForValidation);
  console.log("🚀 Data after Zod validation:", data);

  // Lấy tuyến đường hiện tại
  const routeSelected = await prisma.routes.findUnique({
    where: { id: data.id },
  });
  console.log("🚀 Selected route from DB:", routeSelected);

  if (!routeSelected) {
    throw new Error("Tuyến đường không tồn tại !");
  }

  // Kiểm tra khoá tuyến nếu cần
  if (data.status === "INACTIVE") {
    const activeSchedule = await prisma.schedules.findFirst({
      where: {
        route_id: data.id,
        status: "ACTIVE",
      },
    });
    console.log("🚀 Active schedule check:", activeSchedule);

    if (activeSchedule) {
      throw new Error(
        `Không thể khoá tuyến đường này vì có lịch trình #${activeSchedule.id} hoạt động đang sử dụng !`
      );
    }
  }

  // Chuẩn bị dữ liệu update
  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.start_pickup) updateData.start_pickup = data.start_pickup;
  if (data.end_pickup) updateData.end_pickup = data.end_pickup;
  if (data.total_distance !== undefined) updateData.total_distance = data.total_distance;
  if (data.total_time !== undefined) updateData.total_time = data.total_time;
  if (data.status) updateData.status = data.status;

  console.log("🚀 Update data before routePickups:", updateData);

  // Cập nhật routePickups nếu có
  if (data.routePickups) {
    console.log("🚀 routePickups to update:", data.routePickups);

    await prisma.route_pickups.deleteMany({ where: { route_id: data.id } });

    updateData.routePickups = {
      create: data.routePickups.map((p: any) => ({
        pickup_id: p.pickup_id,
        order: p.order,
      })),
    };
  }

  // Update DB
  const route = await prisma.routes.update({
    where: { id: data.id },
    data: updateData,
    include: {
      routePickups: { include: { pickup: true }, orderBy: { order: "asc" } },
    },
  });

  console.log("🚀 Updated route from DB:", route);

  // Response
  const response: RouteResponse = {
    id: route.id,
    name: route.name,
    start_pickup: route.start_pickup,
    end_pickup: route.end_pickup,
    total_distance: route.total_distance,
    total_time: route.total_time,
    status: route.status,
    routePickups: route.routePickups.map((rp) => ({
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

  console.log("🚀 Final response:", response);

  return isPutRest(response);
},

  // Xóa tuyến đường
  async delete(input: any) {
    const data = deleteSchema.parse(input);

    const route = await prisma.routes.delete({
      where: { id: data.id },
      include: {
        routePickups: { include: { pickup: true }, orderBy: { order: "asc" } },
      },
    });

    const response: RouteResponse = {
      id: route.id,
      name: route.name,
      start_pickup: route.start_pickup,
      end_pickup: route.end_pickup,
      total_distance: route.total_distance,
      total_time: route.total_time,
      status: route.status,
      routePickups: route.routePickups.map((rp) => ({
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
