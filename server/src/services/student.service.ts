import { StudentStatus } from "@prisma/client";
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
        pickup: true,
      },
    });
    return isGetRest(
      students.map(
        (student) =>
          ({
            id: student.id,
            avatar: student.avatar,
            card_id: student.card_id,
            full_name: student.full_name,
            birth_date: student.birth_date,
            gender: student.gender,
            address: student.address,
            status: student.status,
            parent: {
              id: student.parent.id,
              full_name: student.parent.full_name,
            },
            class: {
              id: student.class.id,
              name: student.class.name,
            },
            pickup: {
              id: student.pickup.id,
              name: student.pickup.name,
            },
          } as StudentResponse)
      )
    );
  },

  async getAllStudying() {
    const students = await prisma.students.findMany({
      include: {
        parent: true,
        class: true,
        pickup: true,
      },
      where: {
        status: StudentStatus.STUDYING,
      },
    });
    return isGetRest(
      students.map(
        (student) =>
          ({
            id: student.id,
            avatar: student.avatar,
            card_id: student.card_id,
            full_name: student.full_name,
            birth_date: student.birth_date,
            gender: student.gender,
            address: student.address,
            status: student.status,
            parent: {
              id: student.parent.id,
              full_name: student.parent.full_name,
            },
            class: {
              id: student.class.id,
              name: student.class.name,
            },
            pickup: {
              id: student.pickup.id,
              name: student.pickup.name,
            },
          } as StudentResponse)
      )
    );
  },

  async create(input: any) {
    const data = createSchema.parse(input);
    const student = await prisma.students.create({
      data: {
        full_name: data.full_name,
        birth_date: data.birth_date,
        gender: data.gender,
        address: data.address,
        status: data.status,

        parent: {
          connect: { id: data.parent_id },
        },
        class: {
          connect: { id: data.class_id },
        },
        pickup: {
          connect: { id: data.pickup_id },
        },
      },
      include: {
        parent: true,
        class: true,
        pickup: true,
      },
    });

    const studentUpdateCardId = await prisma.students.update({
      where: { id: student.id },
      data: { card_id: "SB" + String(student.id).padStart(10, "0") },
    });

    return isCreateRest({
      id: student.id,
      card_id: studentUpdateCardId.card_id,
      avatar: student.avatar,
      full_name: student.full_name,
      birth_date: student.birth_date,
      gender: student.gender,
      address: student.address,
      status: student.status,
      parent: {
        id: student.parent.id,
        full_name: student.parent.full_name,
      },
      class: {
        id: student.class.id,
        name: student.class.name,
      },
      pickup: {
        id: student.pickup.id,
        name: student.pickup.name,
      },
    } as StudentResponse);
  },

  async uploadAvatar(id: number, file: Express.Multer.File) {
    const avatarUrl = await FirebaseService.uploadStudentImage(
      file as unknown as File
    );
    await prisma.students.update({
      where: { id },
      data: { avatar: avatarUrl },
    });
    return isPutRest({ id, avatar: avatarUrl });
  },

  async update(input: any) {
    const data = updateSchema.parse(input);
    const updateData: any = {};

    if (data.full_name) updateData.full_name = data.full_name;
    if (data.birth_date) updateData.birth_date = data.birth_date;
    if (data.gender) updateData.gender = data.gender;
    if (data.address) updateData.address = data.address;
    if (data.status) updateData.status = data.status;
    if (data.parent_id) updateData.parent_id = data.parent_id;
    if (data.class_id) updateData.class_id = data.class_id;
    if (data.pickup_id) updateData.pickup_id = data.pickup_id;

    const student = await prisma.students.update({
      where: { id: data.id },
      data: updateData,
      include: {
        parent: true,
        class: true,
        pickup: true,
      },
    });

    return isPutRest({
      id: student.id,
      avatar: student.avatar,
      card_id: student.card_id,
      full_name: student.full_name,
      birth_date: student.birth_date,
      gender: student.gender,
      address: student.address,
      status: student.status,
      parent: {
        id: student.parent.id,
        full_name: student.parent.full_name,
      },
      class: {
        id: student.class.id,
        name: student.class.name,
      },
      pickup: {
        id: student.pickup.id,
        name: student.pickup.name,
      },
    } as StudentResponse);
  },
};

export default StudentService;
