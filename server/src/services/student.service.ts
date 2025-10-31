import prisma from "../configs/prisma.config";
import { createSchema } from "../schemas/student.schema";
import { isCreateRest, isGetRest } from "../utils/rest.util";
import FirebaseService from "./firebase.service";

const StudentService = {
    async getList() {
        const students = await prisma.students.findMany({
            include: {
                parent: true,
                class: true
            }
        });
        return isGetRest(students.map(student => ({
            id: student.id,
            parent: {
                id: student.parent.id,
                full_name: student.parent.full_name,
            }, 
            class: {
                id: student.class.id,
                name: student.class.name,
            },
            full_name: student.full_name,
            avatar: student.avatar,
            birth_date: student.birth_date,
            gender: student.gender,
            address: student.address,
            status: student.status
        })));
    },

    async create(input: any, file?: Express.Multer.File) {
        const data = createSchema.parse(input);
        let avatarUrl = "";
        if (file) {
            avatarUrl = await FirebaseService.uploadStudentImage(file as unknown as File);
        }

        const student = await prisma.students.create({
            data: {
                avatar: avatarUrl,
                full_name: data.fullName,
                birth_date: data.birthDate,
                gender: data.gender,
                address: data.address,
                status: data.status,
                parent: {
                    connect: { id: 1 } 
                },
                class: {
                    connect: { id: 1 } 
                }
            }
        });
        return isCreateRest({
            id: student.id,
            full_name: student.full_name,
            avatar: student.avatar,
            birth_date: student.birth_date,
            gender: student.gender,
            status: student.status,
            parent_id: student.parent_id,
            class_id: student.class_id
        });
    }
}

export default StudentService;