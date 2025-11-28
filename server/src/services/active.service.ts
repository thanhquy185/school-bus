import { ActiveStatus } from "@prisma/client";
import prisma from "../configs/prisma.config";
import { ActiveResponse } from "../responses/active.response";
import {
  createSchema,
  getSchema,
  updateSchema,
} from "../schemas/active.schema";
import { isGetRest, isCreateRest, isPutRest } from "../utils/rest.util";
import Active_pickupService from "./active-pickup.service";
import Active_studentService from "./active-student.service";

const ActiveService = {
  async getById(input: any) {
    const data = getSchema.parse(input);
    const active = await prisma.actives.findUnique({
      include: {
        schedule: {
          include: {
            route: true,
            bus: true,
            driver: true,
          },
        },
        active_pickups: { include: { pickup: true } },
        active_students: { include: { student: true } },
      },
      where: {
        id: data.id,
      },
    });

    return isGetRest({
      id: active.id,
      schedule: {
        id: active.schedule.id,
        start_date: active.schedule.start_date,
        end_date: active.schedule.end_date,
        start_time: active.schedule.start_time,
        end_time: active.schedule.end_time,
        days_of_week: active.schedule.days_of_week,
        route: {
          id: active.schedule.route.id,
          name: active.schedule.route.name,
        },
        bus: {
          id: active.schedule.bus.id,
          license_plate: active.schedule.bus.license_plate,
          capacity: active.schedule.bus.capacity,
        },
        driver: {
          id: active.schedule.driver.id,
          full_name: active.schedule.driver.full_name,
        },
      },
      start_at: active.start_at,
      end_at: active.end_at,
      bus_lat: active.bus_lat,
      bus_lng: active.bus_lng,
      bus_speed: active.bus_speed,
      bus_status: active.bus_status,
      status: active.status,
      active_pickups: active.active_pickups.map((ap) => ({
        pickup: ap.pickup,
        order: ap.order,
        at: ap.at,
        status: ap.status,
      })),
      active_students: active.active_students.map((as) => ({
        student: as.student,
        at: as.at,
        status: as.status,
      })),
    } as ActiveResponse);
  },

  async getAll() {
    const actives = await prisma.actives.findMany({
      include: {
        schedule: {
          include: {
            route: true,
            bus: true,
            driver: true,
          },
        },
        active_pickups: { include: { pickup: true } },
        active_students: { include: { student: true } },
      },
    });

    return isGetRest(
      actives.map(
        (active) =>
        ({
          id: active.id,
          schedule: {
            id: active.schedule.id,
            start_date: active.schedule.start_date,
            end_date: active.schedule.end_date,
            start_time: active.schedule.start_time,
            end_time: active.schedule.end_time,
            days_of_week: active.schedule.days_of_week,
            route: {
              id: active.schedule.route.id,
              name: active.schedule.route.name,
            },
            bus: {
              id: active.schedule.bus.id,
              license_plate: active.schedule.bus.license_plate,
              capacity: active.schedule.bus.capacity,
            },
            driver: {
              id: active.schedule.driver.id,
              full_name: active.schedule.driver.full_name,
            },
          },
          start_at: active.start_at,
          end_at: active.end_at,
          bus_lat: active.bus_lat,
          bus_lng: active.bus_lng,
          bus_speed: active.bus_speed,
          bus_status: active.bus_status,
          status: active.status,
          active_pickups: active.active_pickups.map((ap) => ({
            pickup: ap.pickup,
            order: ap.order,
            at: ap.at,
            status: ap.status,
          })),
          active_students: active.active_students.map((as) => ({
            student: as.student,
            at: as.at,
            status: as.status,
          })),
        } as ActiveResponse)
      )
    );
  },

  async getAllActive() {
    const actives = await prisma.actives.findMany({
      include: {
        schedule: {
          include: {
            route: {
              include: {
                routePickups: {
                  include: {
                    pickup: true,
                  },
                },
              },
            },
            bus: true,
            driver: true,
          },
        },
        active_pickups: { include: { pickup: true } },
        active_students: { include: { student: true } },
      },
      where: {
        status: ActiveStatus.ACTIVE,
      },
    });

    return isGetRest(
      actives.map(
        (active) =>
        ({
          id: active.id,
          schedule: {
            id: active.schedule.id,
            start_date: active.schedule.start_date,
            end_date: active.schedule.end_date,
            start_time: active.schedule.start_time,
            end_time: active.schedule.end_time,
            days_of_week: active.schedule.days_of_week,
            route: {
              id: active.schedule.route.id,
              name: active.schedule.route.name,
              start_pickup: active.schedule.route.start_pickup,
              end_pickup: active.schedule.route.end_pickup,
              routePickups: active.schedule.route.routePickups.map((rp) => ({
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
            },
            bus: {
              id: active.schedule.bus.id,
              license_plate: active.schedule.bus.license_plate,
              capacity: active.schedule.bus.capacity,
            },
            driver: {
              id: active.schedule.driver.id,
              full_name: active.schedule.driver.full_name,
            },
          },
          start_at: active.start_at,
          end_at: active.end_at,
          bus_lat: active.bus_lat,
          bus_lng: active.bus_lng,
          bus_speed: active.bus_speed,
          bus_status: active.bus_status,
          status: active.status,
          active_pickups: active.active_pickups.map((ap) => ({
            pickup: ap.pickup,
            order: ap.order,
            at: ap.at,
            status: ap.status,
          })),
          active_students: active.active_students.map((as) => ({
            student: as.student,
            at: as.at,
            status: as.status,
          })),
        } as ActiveResponse)
      )
    );
  },

  async create(input: any) {
    const data = createSchema.parse(input);

    const active = await prisma.actives.create({
      data: {
        start_at: data.start_at,
        end_at: data.end_at ?? null,
        bus_lat: data.bus_lat ?? null,
        bus_lng: data.bus_lng ?? null,
        bus_speed: data.bus_speed ?? null,
        bus_status: data.bus_status,
        status: data.status,
        schedule: { connect: { id: data.schedule_id } },
      },
      include: {
        schedule: true,
      },
    });

    const schedule = await prisma.schedules.findUnique({
      where: { id: data.schedule_id },
      include: {
        route: { include: { routePickups: true } },
      },
    });
    if (!schedule) throw new Error("Lịch trình không tồn tại");

    const routePickups = schedule.route.routePickups;
    const active_pickupsData = routePickups.map((routePickup) => ({
      active_id: active.id,
      pickup_id: routePickup.pickup_id,
      order: routePickup.order,
      at: undefined,
      status: "PENDING",
    }));
    await Promise.all(
      active_pickupsData.map((ap) => Active_pickupService.create(ap))
    );

    const students = await prisma.students.findMany({
      where: {
        pickup_id: {
          in: routePickups.map((routePickup) => routePickup.pickup_id),
        },
      },
    });
    const active_studentsData = students.map((student) => ({
      active_id: active.id,
      student_id: student.id,
      at: undefined,
      status: "PENDING",
    }));
    await Promise.all(
      active_studentsData.map((as) => Active_studentService.create(as))
    );

    const createdActive = await prisma.actives.findUnique({
      where: { id: active.id },
      include: {
        schedule: {
          include: {
            route: true,
            bus: true,
            driver: true,
          },
        },
        active_pickups: { include: { pickup: true } },
        active_students: { include: { student: true } },
      },
    });

    return isCreateRest({
      id: createdActive.id,
      schedule: {
        id: createdActive.schedule.id,
        start_date: createdActive.schedule.start_date,
        end_date: createdActive.schedule.end_date,
        start_time: createdActive.schedule.start_time,
        end_time: createdActive.schedule.end_time,
        days_of_week: createdActive.schedule.days_of_week,
        route: {
          id: createdActive.schedule.route.id,
          name: createdActive.schedule.route.name,
        },
        bus: {
          id: createdActive.schedule.bus.id,
          license_plate: createdActive.schedule.bus.license_plate,
          capacity: createdActive.schedule.bus.capacity,
        },
        driver: {
          id: createdActive.schedule.driver.id,
          full_name: createdActive.schedule.driver.full_name,
        },
      },
      start_at: createdActive.start_at,
      end_at: createdActive.end_at,
      bus_lat: createdActive.bus_lat,
      bus_lng: createdActive.bus_lng,
      bus_speed: createdActive.bus_speed,
      bus_status: createdActive.bus_status,
      status: createdActive.status,
      active_pickups: createdActive.active_pickups.map((ap) => ({
        pickup: ap.pickup,
        order: ap.order,
        at: ap.at,
        status: ap.status,
      })),
      active_students: createdActive.active_students.map((as) => ({
        student: as.student,
        at: as.at,
        status: as.status,
      })),
    } as ActiveResponse);
  },

  async update(input: any) {
    const data = updateSchema.parse(input);

    const updateData: any = {};
    if (data.schedule_id) updateData.schedule_id = data.schedule_id;
    if (data.start_at) updateData.start_at = data.start_at;
    if (data.end_at) updateData.end_at = data.end_at;
    if (data.bus_lat !== undefined) updateData.bus_lat = data.bus_lat;
    if (data.bus_lng !== undefined) updateData.bus_lng = data.bus_lng;
    if (data.bus_speed !== undefined) updateData.bus_speed = data.bus_speed;
    if (data.bus_status) updateData.bus_status = data.bus_status;
    if (data.status) updateData.status = data.status;

    const active = await prisma.actives.update({
      where: { id: data.id },
      data: updateData,
      include: {
        schedule: {
          include: {
            route: true,
            bus: true,
            driver: true,
          },
        },
        active_pickups: { include: { pickup: true } },
        active_students: { include: { student: true } },
      },
    });

    return isPutRest({
      id: active.id,
      schedule: {
        id: active.schedule.id,
        start_date: active.schedule.start_date,
        end_date: active.schedule.end_date,
        start_time: active.schedule.start_time,
        end_time: active.schedule.end_time,
        days_of_week: active.schedule.days_of_week,
        route: {
          id: active.schedule.route.id,
          name: active.schedule.route.name,
        },
        bus: {
          id: active.schedule.bus.id,
          license_plate: active.schedule.bus.license_plate,
          capacity: active.schedule.bus.capacity,
        },
        driver: {
          id: active.schedule.driver.id,
          full_name: active.schedule.driver.full_name,
        },
      },
      start_at: active.start_at,
      end_at: active.end_at,
      bus_lat: active.bus_lat,
      bus_lng: active.bus_lng,
      bus_speed: active.bus_speed,
      bus_status: active.bus_status,
      status: active.status,
      active_pickups: active.active_pickups.map((ap) => ({
        pickup: ap.pickup,
        order: ap.order,
        at: ap.at,
        status: ap.status,
      })),
      active_students: active.active_students.map((as) => ({
        student: as.student,
        at: as.at,
        status: as.status,
      })),
    } as ActiveResponse);
  },

  async updateFromLocationSocket(socketData: {
    id: number,
    bus_lat: number,
    bus_lng: number,
    bus_speed: number,
    bus_status: string
  }) {
    const active = await prisma.actives.findUnique({ where: { id: socketData.id }});

    const activeUpdated = await prisma.actives.update({
      where: active,
      data: {
        bus_lat: socketData.bus_lat,
        bus_lng: socketData.bus_lng,
        bus_speed: socketData.bus_speed,
        bus_status: socketData.bus_status,
      }
    });

    return {
      id: activeUpdated.id,
      bus_lat: activeUpdated.bus_lat,
      bus_lng: activeUpdated.bus_lng,
      bus_speed: activeUpdated.bus_speed,
      bus_status: activeUpdated.bus_status
    }
  }
};

export default ActiveService;
