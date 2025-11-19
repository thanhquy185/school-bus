import prisma from "../configs/prisma.config";
import {
  createScheduleSchema,
  updateScheduleSchema,
} from "../schemas/schedule.schema";
import {
  isCreateRest,
  isDeleteRest,
  isGetRest,
  isPutRest,
} from "../utils/rest.util";
import { ScheduleResponse } from "../responses/schedule.response";


function validateTime(startDate: string, endDate: string, startTime: string, endTime: string) {
  if (startDate > endDate)
    throw new Error("Ngày bắt đầu không được lớn hơn ngày kết thúc");

  if (startTime >= endTime)
    throw new Error("Giờ bắt đầu phải nhỏ hơn giờ kết thúc");
}

async function checkConflictSchedule({
  driverId,
  busId,
  routeId,
  startDate,
  endDate,
  startTime,
  endTime,
  ignoreId,
}: {
  driverId: number;
  busId: number;
  routeId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  ignoreId?: number;
}) {

  // Base condition time overlap
  const timeOverlap = {
    AND: [
      { start_date: { lte: endDate } },
      { end_date: { gte: startDate } },
      { start_time: { lte: endTime } },
      { end_time: { gte: startTime } },
    ],
  };

  // 1. Conflict for driver on same route
  const driverConflict = await prisma.schedules.findFirst({
    where: {
      driver_id: driverId,
      route_id: routeId,
      NOT: ignoreId ? { id: ignoreId } : undefined,
      ...timeOverlap,
    },
  });

  if (driverConflict) {
    throw new Error("Tài xế đã có lịch khác trùng thời gian trên tuyến này");
  }

  // 2. Conflict for bus on same route
  const busConflict = await prisma.schedules.findFirst({
    where: {
      bus_id: busId,
      route_id: routeId,
      NOT: ignoreId ? { id: ignoreId } : undefined,
      ...timeOverlap,
    },
  });

  if (busConflict) {
    throw new Error("Xe buýt đã có lịch khác trùng thời gian trên tuyến này");
  }
}

function mapSchedule(schedule: any): ScheduleResponse {
  return {
    id: schedule.id,
    startDate: schedule.start_date,
    endDate: schedule.end_date,
    startTime: schedule.start_time,
    endTime: schedule.end_time,
    status: schedule.status,
    driver: {
      id: schedule.driver.id,
      avatar: schedule.driver.avatar,
      full_name: schedule.driver.full_name,
      phone: schedule.driver.phone,
    },
    bus: {
      id: schedule.bus.id,
      license_plate: schedule.bus.license_plate,
      capacity: schedule.bus.capacity,
    },
    route: {
      id: schedule.route.id,
      name: schedule.route.name,
      startPickup: schedule.route.start_pickup,
      endPickup: schedule.route.end_pickup,
      totalDistance: schedule.route.total_distance,
      totalTime: schedule.route.total_time,
      pickups: schedule.route.pickups.map((p: any) => ({
        pickup: {
          id: p.pickup.id,
          name: p.pickup.name,
          category: p.pickup.category,
          lat: p.pickup.lat,
          lng: p.pickup.lng,
          status: p.pickup.status,
        },
        order: p.order,
      })),
    },
  };
}

const ScheduleService = {

  async get(input: any) {
    const { id } = updateScheduleSchema.parse(input);

    const schedule = await prisma.schedules.findUnique({
      where: { id },
      include: {
        driver: true,
        bus: true,
        route: {
          include: {
            pickups: { include: { pickup: true }, orderBy: { order: "asc" } },
          },
        },
      },
    });

    if (!schedule) throw new Error("Không tìm thấy lịch trình");

    return isGetRest(mapSchedule(schedule));
  },

  async getAll() {
    const schedules = await prisma.schedules.findMany({
      include: {
        driver: true,
        bus: true,
        route: {
          include: {
            pickups: { include: { pickup: true }, orderBy: { order: "asc" } },
          },
        },
      },
    });

    return isGetRest(schedules.map(mapSchedule));
  },

  async getAllActive() {
    const schedules = await prisma.schedules.findMany({
      include: {
        driver: true,
        bus: true,
        route: {
          include: {
            pickups: { include: { pickup: true }, orderBy: { order: "asc" } },
          },
        },
      },
      where: {
        status: "ACTIVE"
      }
    });

    return isGetRest(schedules.map(mapSchedule));
  },

  async create(input: any) {
    const data = createScheduleSchema.parse(input);

    // Validate date/time
    validateTime(data.startDate, data.endDate, data.startTime, data.endTime);

    // Check conflicts
    await checkConflictSchedule({
      routeId: data.routeId,
      busId: data.busId,
      driverId: data.driverId,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      endTime: data.endTime,
    });

    const schedule = await prisma.schedules.create({
      data: {
        start_date: data.startDate,
        end_date: data.endDate,
        start_time: data.startTime,
        end_time: data.endTime,
        status: data.status,
        driver_id: data.driverId,
        bus_id: data.busId,
        route_id: data.routeId,
      },
      include: {
        driver: true,
        bus: true,
        route: {
          include: {
            pickups: { include: { pickup: true }, orderBy: { order: "asc" } },
          },
        },
      },
    });

    return isCreateRest(mapSchedule(schedule));
  },

  async update(input: any) {
    const data = updateScheduleSchema.parse(input);

    const existing = await prisma.schedules.findUnique({ where: { id: data.id } });
    if (!existing) throw new Error("Không tìm thấy lịch trình");

    const startDate = data.startDate ?? existing.start_date;
    const endDate = data.endDate ?? existing.end_date;
    const startTime = data.startTime ?? existing.start_time;
    const endTime = data.endTime ?? existing.end_time;
    const driverId = data.driverId ?? existing.driver_id;
    const busId = data.busId ?? existing.bus_id;
    const routeId = data.routeId ?? existing.route_id;

    validateTime(startDate, endDate, startTime, endTime);

    await checkConflictSchedule({
      busId,
      routeId,
      driverId,
      startDate,
      endDate,
      startTime,
      endTime,
      ignoreId: data.id,
    });

    const schedule = await prisma.schedules.update({
      where: { id: data.id },
      data: {
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        status: data.status ?? existing.status,
        driver_id: driverId,
        bus_id: busId,
        route_id: routeId,
      },
      include: {
        driver: true,
        bus: true,
        route: {
          include: {
            pickups: { include: { pickup: true }, orderBy: { order: "asc" } },
          },
        },
      },
    });

    return isPutRest(mapSchedule(schedule));
  },

  async delete(input: any) {
    const { id } = updateScheduleSchema.parse(input);

    const schedule = await prisma.schedules.delete({
      where: { id },
      include: {
        driver: true,
        bus: true,
        route: {
          include: {
            pickups: { include: { pickup: true }, orderBy: { order: "asc" } },
          },
        },
      },
    });

    return isDeleteRest(mapSchedule(schedule));
  },
};

export default ScheduleService;
