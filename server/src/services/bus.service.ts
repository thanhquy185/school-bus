import prisma from "../configs/prisma.config";
import { BusResponse } from "../responses/bus.respone";
import { createSchema, updateSchema } from "../schemas/bus.schema"
import { isCreateRest, isGetRest, isPutRest } from "../utils/rest.util";


const BusService = {
    async getList() {
        const buses = await prisma.buses.findMany();
        return isGetRest(buses);
    },

    async create(input: any) {
        const data = createSchema.parse(input);
        const buses = await prisma.buses.create(
            {
                data: {
                    licensePlate: data.licensePlate,
                    capacity: data.capacity,
                    status: data.status
                }
            }
        );

        return isCreateRest(
            {
                id: buses.id,
                licensePlate: buses.licensePlate,
                capacity: buses.capacity,
                status: buses.status
            } as BusResponse
        );
    },

    async update(input: any) {
        const data = updateSchema.parse(input);
        const bus = await prisma.buses.findUnique({
            where: {
                id: data.id
            }
        });

        // if (bus.status === "MAINTENANCE") throw new Error("Xe buýt đang trong trạng thái bảo trì, không thể cập nhật");

        const updateData: any = {};

        if (data.licensePlate) {
            updateData.licensePlate = data.licensePlate;
        }

        if (data.capacity) {
            updateData.capacity = data.capacity;
        }

        if (data.status) {
            updateData.status = data.status;
        }

        const buses = await prisma.buses.update(
            {
                where: {
                    id: data.id
                },
                data: updateData
            }
        );

        return isPutRest(
            {
                id: buses.id,
                licensePlate: buses.licensePlate,
                capacity: buses.capacity,
                status: buses.status
            } as BusResponse
        );
    }
}

export default BusService