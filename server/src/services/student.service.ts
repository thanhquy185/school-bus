import prisma from "../configs/prisma.config";
import { StudentResponse } from "../responses/student.response";
import { createSchema, updateSchema } from "../schemas/student.schema";
import { isCreateRest, isGetRest, isPutRest } from "../utils/rest.util";
import FirebaseService from "./firebase.service";

const StudentService = {
    async getAll() {
        const students = await prisma.students.findMany({
            include: {
                parent: true,
                class: true,
                pickup: true
            }
        });
        return isGetRest(students.map(student => ({
            id: student.id,
            avatar: student.avatar,
            full_name: student.full_name,
            birth_date: student.birth_date,
            gender: student.gender,
            address: student.address,
            status: student.status,
            parent: {
                id: student.parent.id,
                full_name: student.parent.full_name
            },
            class: {
                id: student.class.id,
                name: student.class.name
            },
            pickup: {
                id: student.pickup.id,
                name: student.pickup.name
            }
        } as StudentResponse)));
    },

    async getAllStudying() {
        const students = await prisma.students.findMany({
            include: {
                parent: true,
                class: true,
                pickup: true
            },
            where: {
                status: "STUDYING",
            }
        });
        return isGetRest(students.map(student => ({
            id: student.id,
            avatar: student.avatar,
            full_name: student.full_name,
            birth_date: student.birth_date,
            gender: student.gender,
            address: student.address,
            status: student.status,
            parent: {
                id: student.parent.id,
                full_name: student.parent.full_name
            },
            class: {
                id: student.class.id,
                name: student.class.name
            },
            pickup: {
                id: student.pickup.id,
                name: student.pickup.name
            }
        } as StudentResponse)));
    },

    async create(input: any) {
        const data = createSchema.parse(input);
        const student = await prisma.students.create({
            data: {
                id: data.id,
                full_name: data.fullName,
                birth_date: data.birthDate,
                gender: data.gender,
                address: data.address,
                status: data.status,

                parent: {
                    connect: { id: data.parentId } 
                },
                class: {
                    connect: { id: data.classId } 
                },
                pickup: {
                    connect: { id: data.pickupId }
                }
            },
            include: {
                parent: true,
                class: true,
                pickup: true
            }
        });

        return isCreateRest({
            id: student.id,
            avatar: student.avatar,
            full_name: student.full_name,
            birth_date: student.birth_date,
            gender: student.gender,
            address: student.address,
            status: student.status,
            parent: {
                id: student.parent.id,
                full_name: student.parent.full_name
            },
            class: {
                id: student.class.id,
                name: student.class.name
            },
            pickup: {
                id: student.pickup.id,
                name: student.pickup.name
            }
        } as StudentResponse);
    },

    async uploadAvatar(id: string, file: Express.Multer.File) {
        const avatarUrl = await FirebaseService.uploadStudentImage(file as unknown as File);
        await prisma.students.update({
            where: { id },
            data: { avatar: avatarUrl }
        });
        return isPutRest({ id, avatar: avatarUrl });
    },

    async update(input: any) {
        const data = updateSchema.parse(input);
        const updateData: any = {};

        if (data.fullName) updateData.full_name = data.fullName;
        if (data.birthDate) updateData.birth_date = data.birthDate;
        if (data.gender) updateData.gender = data.gender;
        if (data.address) updateData.address = data.address;
        if (data.status) updateData.status = data.status;
        if (data.parentId) updateData.parent_id = data.parentId;
        if (data.classId) updateData.class_id = data.classId;
        if (data.pickupId) updateData.pickup_id = data.pickupId;

        const student =  await prisma.students.update(
            {
                where: { id: data.id },
                data: updateData,
                include: {
                    parent: true,
                    class: true,
                    pickup: true
                }
            }
        );
        
        return isPutRest({
            id: student.id,
            avatar: student.avatar,
            full_name: student.full_name,
            birth_date: student.birth_date,
            gender: student.gender,
            address: student.address,
            status: student.status,
            parent: {
                id: student.parent.id,
                full_name: student.parent.full_name
            },
            class: {
                id: student.class.id,
                name: student.class.name
            },
            pickup: {
                id: student.pickup.id,
                name: student.pickup.name
            }
        } as StudentResponse);
    }
}

export default StudentService;