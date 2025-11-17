
import prisma from "../configs/prisma.config";
import { ParentResponse } from "../responses/parent.response";
import { changePickupStudent, createSchema, deleteSchema, getSchema, updateSchema } from "../schemas/parent.schema";
import { isCreateRest, isDeleteRest, isGetRest, isPutRest } from "../utils/rest.util";
import AccountService from './account.service';
import { hashPassword } from "../utils/bcypt.util";
import FirebaseService from "./firebase.service";
import { verifyToken } from "../utils/jwt.util";
import { AuthenticationPayload } from "../middlewares/auth.middleware";
import { StudentResponse } from "../responses/student.response";
import { RestResponse } from "../responses/rest.response";

const ParentService = {
  async get(input: any) {
    const data = getSchema.parse(input);
    const parent = await prisma.parents.findUnique(
      {
        where: {
          id: data.id
        }
      }
    );

    return isGetRest(
      {
        id: parent.id,
        full_name: parent.full_name,
        phone: parent.phone,
        email: parent.email,
        address: parent.address,
        account_id: parent.account_id
      } as ParentResponse
    );

  },

  async getByAccountId(input: any) {
    const data = getSchema.parse(input);

    const parent = await prisma.parents.findUnique(
      {
        where: {
          account_id: data.id
        }
      }
    );

    return isGetRest(
      {
        id: parent.id,
        full_name: parent.full_name,
        phone: parent.phone,
        email: parent.email,
        address: parent.address,
        account_id: parent.account_id
      } as ParentResponse
    );
  },

  async getList() {
    const parent = await prisma.parents.findMany({
      include: {
        account: true
      },
    });
    return isGetRest(parent.map((parent) => ({
      id: parent.id,
      avatar: parent.avatar,
      full_name: parent.full_name,
      phone: parent.phone,
      email: parent.email,
      address: parent.address,

      account_id: parent.account_id,
      username: parent.account.username,
      status: parent.account.status 
    } as ParentResponse)));
  },

  async update(input: any) {
    const data = updateSchema.parse(input);
    const updateData: any = {};

    const parent = await prisma.parents.findUnique({ where: { id: data.id }});

    if (data.fullName) {
      updateData.full_name = data.fullName;
    }

    if (data.email) {
      updateData.email = data.email;
    }

    if (data.address) {
      updateData.address = data.address;
    }

    if (data.phone) {
      updateData.phone = data.phone;
    }

    if (data.password || data.status) {
      await AccountService.update({
        id: parent.account_id,
        password: data.password,
        status: data.status
      });
    }

    const parentUpdated  = await prisma.parents.update(
      {
        where: {
          id: data.id
        },
        include: {
          account: true
        },
        data: updateData
      }
    );

    return isPutRest({
      id: parentUpdated.id,
      full_name: parentUpdated.full_name,
      email: parentUpdated.email,
      address: parentUpdated.address,
      phone: parentUpdated.phone,
      account_id: parentUpdated.account_id,
      username: parentUpdated.account.username,
      status: parentUpdated.account.status
    } as ParentResponse);
  },

  async create(input: any, file?: Express.Multer.File) {
    const data = createSchema.parse(input);
    const account = await prisma.accounts.create({
      data: {
        username: data.username,
        password: await hashPassword(data.password),
        role: "PARENT",
        status: data.status
      }
    });

    const parent = await prisma.parents.create({
      data: {
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        avatar: file ? file.filename : null,
        account: {
          connect: { id: account.id }
        }
      }
    });

    return isCreateRest(
      {
        id: parent.id,
        full_name: parent.full_name,
        phone: parent.phone,
        email: parent.email,
        address: parent.address,

        account_id: account.id,
        username: account.username,
        status: account.status
      } as ParentResponse
    );
  },

  async uploadAvatar(id: number, file: Express.Multer.File) {
    const avatarUrl = await FirebaseService.uploadParentImage(file as unknown as File);
    await prisma.parents.update({
      where: { id },
      data: { avatar: avatarUrl }
    });

    return isPutRest({ id, avatar: avatarUrl });
  },

  async getProfile(authentication: string) {
    const payload: AuthenticationPayload = await verifyToken(authentication);
    const account = await prisma.accounts.findUnique({
      where: { username: payload.username },
      include: { parents: true }
    });

  },

  async getStudents(authentication: string) {
    const payload: AuthenticationPayload = await verifyToken(authentication);
    console.log(payload)
    const account = await prisma.accounts.findUnique({
      where: {
        username: payload.username
      },
      include: {
        parents: {
          include: {
            students: {
              include: {
                parent: true,
                class: true,
                pickup: true
              }
            }
          }
        }
      }
    })

    return isGetRest(account.parents.students.map(student => ({
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

  async updatePickupStudent(input: unknown) {
    const data = changePickupStudent.parse(input);
    const student = await prisma.students.findUnique({ where: { id: data.id } });

    const studentUpdated = await prisma.students.update({
      where: { id: student.id },
      data: { pickup: { connect: { id: data.pickupId } } },
      include: {
        parent: true,
        pickup: true,
        class: true
      }
    })

    return isPutRest({
      id: studentUpdated.id,
      avatar: studentUpdated.avatar,
      full_name: studentUpdated.full_name,
      birth_date: studentUpdated.birth_date,
      gender: studentUpdated.gender,
      address: studentUpdated.address,
      status: studentUpdated.status,
      parent: {
        id: studentUpdated.parent.id,
        full_name: studentUpdated.parent.full_name
      },
      class: {
        id: studentUpdated.class.id,
        name: studentUpdated.class.name
      },
      pickup: {
        id: studentUpdated.pickup.id,
        name: studentUpdated.pickup.name
      }
    } as StudentResponse);
  }

}


export default ParentService;