import prisma from "../configs/prisma.config";
import { AccountResponse } from "../responses/account.response";
import { createSchema, deleteSchema, getSchema, updateSchema } from "../schemas/account.schema"
import { hashPassword } from "../utils/bcypt.util";
import { isCreateRest, isDeleteRest, isGetRest, isPutRest } from "../utils/rest.util";

const AccountService = {
    async get(input: any) {
        const data = getSchema.parse(input);
        const account = await prisma.accounts.findUnique({
            where: { id: data.id }
        });
        return isGetRest({ id: account.id, username: account.username, role: account.role, status: account.status } as AccountResponse);
    },

    async create(input: unknown) {
        const data = createSchema.parse(input);
        const password = await hashPassword(data.password);
        const account = await prisma.accounts.create({
            data: {
                username: data.username,
                password: password,
                role: data.role
            }
        })
        return isCreateRest({ id: account.id, username: account.username, role: account.role, status: account.status } as AccountResponse);
    },

    async update(input: unknown) {
        const data = updateSchema.parse(input);
        const updateData: any = {};
        if (data.password) {
            updateData.password = await hashPassword(data.password);
        }
        if (data.role) {
            updateData.role = data.role;
        }
        if (data.status) {
            updateData.status = data.status;
        }
        const account = await prisma.accounts.update({
            where: { id: data.id },
            data: updateData
        })
        return isPutRest({ id: account.id, username: account.username, role: account.role, status: account.status } as AccountResponse);
    },

    async delete(input: unknown) {
        const data = deleteSchema.parse(input);
        const account = await prisma.accounts.delete({
            where: { id: data.id }
        });
        return isDeleteRest({ id: account.id, username: account.username, role: account.role, status: account.status } as AccountResponse);
    }
}

export default AccountService;