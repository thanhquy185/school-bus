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
import { ScheduleStatus } from "@prisma/client";

function validateTime(
  start_date: string,
  end_date: string,
  start_time: string,
  end_time: string
) {
  if (start_date > end_date)
    throw new Error("Ngày bắt đầu không được lớn hơn ngày kết thúc");

  if (start_time >= end_time)
    throw new Error("Giờ bắt đầu phải nhỏ hơn giờ kết thúc");
}

// async function checkConflictSchedule({
//   driver_id,
//   bus_id,
//   route_id,
//   start_date,
//   end_date,
//   start_time,
//   end_time,
//   ignoreId,
// }: {
//   driver_id: number;
//   bus_id: number;
//   route_id: number;
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
//   ignoreId?: number;
// }) {

//   // Base condition time overlap
//   const timeOverlap = {
//     AND: [
//       { start_date: { lte: end_date } },
//       { end_date: { gte: start_date } },
//       { start_time: { lte: end_time } },
//       { end_time: { gte: start_time } },
//     ],
//   };

//   // 1. Conflict for driver on same route
//   const driverConflict = await prisma.schedules.findFirst({
//     where: {
//       driver_id: driver_id,
//       route_id: route_id,
//       NOT: ignoreId ? { id: ignoreId } : undefined,
//       ...timeOverlap,
//     },
//   });

//   if (driverConflict) {
//     throw new Error("Tài xế đã có lịch khác trùng thời gian trên tuyến này");
//   }

//   // 2. Conflict for bus on same route
//   const busConflict = await prisma.schedules.findFirst({
//     where: {
//       bus_id: bus_id,
//       route_id: route_id,
//       NOT: ignoreId ? { id: ignoreId } : undefined,
//       ...timeOverlap,
//     },
//   });

//   if (busConflict) {
//     throw new Error("Xe buýt đã có lịch khác trùng thời gian trên tuyến này");
//   }
// }

function mapSchedule(schedule: any): ScheduleResponse {
  return {
    id: schedule.id,
    start_date: schedule.start_date,
    end_date: schedule.end_date,
    start_time: schedule.start_time,
    end_time: schedule.end_time,
    days_of_week: schedule.days_of_week,
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
      start_pickup: schedule.route.start_pickup,
      end_pickup: schedule.route.end_pickup,
      total_distance: schedule.route.total_distance,
      total_time: schedule.route.total_time,
      routePickups: schedule.route.routePickups.map((p: any) => ({
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
            routePickups: {
              include: { pickup: true },
              orderBy: { order: "asc" },
            },
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
            routePickups: {
              include: { pickup: true },
              orderBy: { order: "asc" },
            },
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
            routePickups: {
              include: { pickup: true },
              orderBy: { order: "asc" },
            },
          },
        },
      },
      where: {
        status: ScheduleStatus.ACTIVE,
      },
    });

    return isGetRest(schedules.map(mapSchedule));
  },

  async create(input: any) {
    const data = createScheduleSchema.parse(input);

    // Validate date/time
    validateTime(
      data.start_date,
      data.end_date,
      data.start_time,
      data.end_time
    );

    // Check conflicts
    // await checkConflictSchedule({
    //   route_id: data.route_id,
    //   bus_id: data.bus_id,
    //   driver_id: data.driver_id,
    //   start_date: data.start_date,
    //   end_date: data.end_date,
    //   start_time: data.start_time,
    //   end_time: data.end_time,
    // });

    const schedule = await prisma.schedules.create({
      data: {
        start_date: data.start_date,
        end_date: data.end_date,
        start_time: data.start_time,
        end_time: data.end_time,
        days_of_week: data.days_of_week,
        status: data.status,
        driver_id: data.driver_id,
        bus_id: data.bus_id,
        route_id: data.route_id,
      },
      include: {
        driver: true,
        bus: true,
        route: {
          include: {
            routePickups: {
              include: { pickup: true },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    return isCreateRest(mapSchedule(schedule));
  },

  async update(input: any) {
    const data = updateScheduleSchema.parse(input);

    const existing = await prisma.schedules.findUnique({
      where: { id: data.id },
    });
    if (!existing) throw new Error("Không tìm thấy lịch trình");

    const start_date = data.start_date ?? existing.start_date;
    const end_date = data.end_date ?? existing.end_date;
    const start_time = data.start_time ?? existing.start_time;
    const end_time = data.end_time ?? existing.end_time;
    const days_of_week = data.days_of_week ?? existing.days_of_week;
    const driver_id = data.driver_id ?? existing.driver_id;
    const bus_id = data.bus_id ?? existing.bus_id;
    const route_id = data.route_id ?? existing.route_id;

    validateTime(start_date, end_date, start_time, end_time);

    // await checkConflictSchedule({
    //   bus_id,
    //   route_id,
    //   driver_id,
    //   start_date,
    //   end_date,
    //   start_time,
    //   end_time,
    //   ignoreId: data.id,
    // });

    const schedule = await prisma.schedules.update({
      where: { id: data.id },
      data: {
        start_date: start_date,
        end_date: end_date,
        start_time: start_time,
        end_time: end_time,
        days_of_week: days_of_week,
        status: data.status ?? existing.status,
        driver_id: driver_id,
        bus_id: bus_id,
        route_id: route_id,
      },
      include: {
        driver: true,
        bus: true,
        route: {
          include: {
            routePickups: {
              include: { pickup: true },
              orderBy: { order: "asc" },
            },
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
            routePickups: {
              include: { pickup: true },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    return isDeleteRest(mapSchedule(schedule));
  },
};

export default ScheduleService;
