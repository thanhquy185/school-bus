import { email } from "zod";
import prisma from "../configs/prisma.config";
import { ParentResponse } from "../responses/parent.response";
import { createSchema, deleteSchema, getSchema, updateSchema } from "../schemas/parent.schema";
import { isCreateRest, isDeleteRest, isGetRest, isPutRest } from "../utils/rest.util";
import AccountService  from './account.service';
import { hashPassword } from "../utils/bcypt.util";

const ParentService ={
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

    async getAll() {
        const parent = await prisma.parents.findMany({
            include: {
          account: {
        select: {
        id: true,
        username: true,
        status: true,

    },
  },
},

        }
        );

        return isGetRest(parent);
    },
    
    async update(input: any) {
        const data = updateSchema.parse(input);
        console.log("Update inut:", input);
        console.log("Update Data Input:", data);
        const updateData: any = {};

        if (data.full_name) {
            updateData.full_name = data.full_name;
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
        console.log("Update Data:", updateData);
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

        return isPutRest(
            {
                id: parent.id,
                full_name: parent.full_name,
                email: parent.email,
                address: parent.address,
                phone: parent.phone
          
            } as ParentResponse
        );
    },


  


async create(input: unknown) {

  const data = createSchema.parse(input);
  let account = null;
  if (data.username && data.password) {
    const hashedPassword = await hashPassword(data.password);

    account = await prisma.accounts.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: "PARENT", 
        status: data.status ?? "ACTIVE",
      },
    });
  }
  

    const parent = await prisma.parents.create({
    data: {
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        address: data.address ?? null,
        avatar: data.avatar ?? "", 
        account: { connect: { id: account.id } }, 
    },
    });



  return isCreateRest({
    id: parent.id,
    full_name: parent.full_name,
    phone: parent.phone,
    email: parent.email,
    address: parent.address,
    account_id: parent.account_id,
  } as ParentResponse);
}

}


export default ParentService;