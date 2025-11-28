import { ActiveStudentStatus } from "@prisma/client";
import prisma from "../configs/prisma.config";
import { ActiveStudentResponse } from "../responses/active-student.response";
import {
  createSchema,
  deleteSchema,
  scanSchema,
  updateSchema,
} from "../schemas/active-student.schema";
import {
  isCreateRest,
  isDeleteRest,
  isGetRest,
  isPutRest,
} from "../utils/rest.util";

const ActiveStudentService = {
  async getAll() {
    const activeStudents = await prisma.active_students.findMany({
      include: {
        student: true,
      },
    });

    return isGetRest(
      activeStudents.map(
        (activeStudent) =>
          ({
            active_id: activeStudent.active_id,
            student_id: activeStudent.student_id,
            student: activeStudent.student,
            at: activeStudent.at,
            status: activeStudent.status,
          } as ActiveStudentResponse)
      )
    );
  },

  async create(input: any) {
    const data = createSchema.parse(input);

    const activeStudent = await prisma.active_students.create({
      data: {
        at: data.at,
        status: data.status,

        active: {
          connect: { id: data.active_id },
        },
        student: {
          connect: { id: data.student_id },
        },
      },
    });

    return isCreateRest({
      active_id: activeStudent.active_id,
      student_id: activeStudent.student_id,
      at: activeStudent.at,
      status: activeStudent.status,
    } as ActiveStudentResponse);
  },

  async update(input: any) {
    const data = updateSchema.parse(input);

    const updateData: any = {};
    if (data.active_id) {
      updateData.active_id = data.active_id;
    }
    if (data.student_id) {
      updateData.student_id = data.student_id;
    }
    if (data.at) {
      updateData.at = data.at;
    }
    if (data.status) {
      updateData.status = data.status;
    }
    const activeStudent = await prisma.active_students.update({
      where: {
        active_id_student_id: {
          active_id: data.active_id,
          student_id: data.student_id,
        },
      },
      data: updateData,
      include: {
        active: true,
      },
    });

    return isPutRest({
      active_id: activeStudent.active_id,
      student_id: activeStudent.student_id,
      at: activeStudent.at,
      status: activeStudent.status,
    } as ActiveStudentResponse);
  },

  async delete(input: any) {
    const data = deleteSchema.parse(input);

    const activeStudent = await prisma.active_students.delete({
      where: {
        active_id_student_id: {
          active_id: data.active_id,
          student_id: data.student_id,
        },
      },
      include: {
        active: true,
      },
    });

    return isDeleteRest({
      active_id: activeStudent.active_id,
      student_id: activeStudent.student_id,
      at: activeStudent.at,
      status: activeStudent.status,
    } as ActiveStudentResponse);
  },

  async scan(input: any) {
    const data = scanSchema.parse(input);

    const student = await prisma.students.findFirst({
      where: {
        card_id: data.card_id,
      },
    });
    if (!student) throw new Error("Học sinh này không tồn tại");

    const activeStudent = await prisma.active_students.findUnique({
      where: {
        active_id_student_id: {
          active_id: data.active_id,
          student_id: student.id,
        },
      },
    });
    if (!activeStudent) throw new Error("Bản ghi học sinh này không tồn tại");
    if (activeStudent.status === ActiveStudentStatus.CHECKED)
      throw new Error("Học sinh này đã được điểm danh");

    const activeStudentUpdate = await prisma.active_students.update({
      where: {
        active_id_student_id: {
          active_id: activeStudent.active_id,
          student_id: activeStudent.student_id,
        },
      },
      data: {
        at: data.at,
        status: ActiveStudentStatus.CHECKED,
      },
      include: {
        active: true,
      },
    });

    return isPutRest({
      active_id: activeStudentUpdate.active_id,
      student_id: activeStudentUpdate.student_id,
      at: activeStudentUpdate.at,
      status: activeStudentUpdate.status,
    } as ActiveStudentResponse);
  },
};

export default ActiveStudentService;
