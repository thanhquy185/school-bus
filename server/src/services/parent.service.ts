
import prisma from "../configs/prisma.config";
import { ParentResponse } from "../responses/parent.response";
import { createSchema, deleteSchema, getSchema, updateSchema } from "../schemas/parent.schema";
import { isCreateRest, isDeleteRest, isGetRest, isPutRest } from "../utils/rest.util";
import AccountService from './account.service';
import { hashPassword } from "../utils/bcypt.util";
import FirebaseService from "./firebase.service";

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
      username: parent.account?.username,
      status: parent.account?.status as "ACTIVE" | "INACTIVE"
    })));
  },

  async update(input: any) {
    const data = updateSchema.parse(input);
    const updateData: any = {};

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
    if (data.avatar) {
      updateData.avatar = data.avatar;
    }
    const parent = await prisma.parents.update(
      {
        where: {
          id: data.id
        },
        data: updateData
      }
    );
    if (parent.account_id && (data.password || data.status)) {
      await AccountService.update({
        id: parent.account_id,
        password: data.password,
        status: data.status,
      });
    }

    return isPutRest({
      id: parent.id,
      full_name: parent.full_name,
      email: parent.email,
      address: parent.address,
      phone: parent.phone
    });
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
        account_id: parent.account_id
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
  }
}


export default ParentService;