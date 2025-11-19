import { get } from "http";
import prisma from "../configs/prisma.config";
import { DriverResponse } from "../responses/driver.response";
import { createSchema, updateSchema } from "../schemas/driver.schema"
import { hashPassword } from "../utils/bcypt.util";
import { isCreateRest, isGetRest, isPutRest } from "../utils/rest.util";
import AccountService from "./account.service";
import FirebaseService from "./firebase.service";
import { AuthenticationPayload } from "../middlewares/auth.middleware";
import { verifyToken } from "../utils/jwt.util";

const DriverService = {
    async getList() {
        const drivers = await prisma.drivers.findMany({
            include: {
                account: true
            }
        });
        return isCreateRest(drivers.map(driver => ({
            id: driver.id,
            avatar: driver.avatar,
            full_name: driver.full_name,
            birth_date: driver.birth_date,
            gender: driver.gender,
            phone: driver.phone,
            email: driver.email,
            address: driver.address,
            status: driver.account.status,
            account_id: driver.account.id,
            username: driver.account.username
        } as DriverResponse)));
    },

    async getByAccount(authorization: string) {
        const payload: AuthenticationPayload = await verifyToken(authorization);

        const driver = await prisma.drivers.findUnique(
            {
                where: {
                    account_id: payload.id
                },

                include: {
                    account: {
                        select: {
                            username: true
                        }
                    }
                }
            }
        );

        return isGetRest(
            {
                id: driver.id,
                avatar: driver.avatar,
                full_name: driver.full_name,
                birth_date: driver.birth_date,
                gender: driver.gender,
                phone: driver.phone,
                email: driver.email,
                address: driver.address,
                account_id: driver.account_id,
                username: driver.account.username
            }
        );
    },

    async create(input: any) {
        const data = createSchema.parse(input);
        const account = await prisma.accounts.create({
            data: {
                username: data.username,
                password: await hashPassword(data.password),
                role: "DRIVER",
                status: data.status
            }
        });

        const driver = await prisma.drivers.create({
            data: {
                full_name: data.fullName,
                birth_date: data.birthDate,
                gender: data.gender,
                phone: data.phone,
                email: data.email,
                address: data.address,
                account: {
                    connect: { id: account.id }
                }
            },
            include: {
                account: true
            }
        });

        return isCreateRest({
            id: driver.id,
            avatar: driver.avatar,
            full_name: driver.full_name,
            birth_date: driver.birth_date,
            gender: driver.gender,
            phone: driver.phone,
            email: driver.email,
            address: driver.address,
            status: driver.account.status,
            account_id: driver.account.id,
            username: driver.account.username
        } as DriverResponse);
    },

    async uploadAvatar(id: number, file: Express.Multer.File) {
        const avatarUrl = await FirebaseService.uploadDriverImage(file as unknown as File);
        await prisma.drivers.update({
            where: { id },
            data: { avatar: avatarUrl }
        });

        return isCreateRest({ id, avatar: avatarUrl });
    },

    async update(input: any) {
        const data = updateSchema.parse(input);
        const updateData: any = {};

        if (data.fullName) {
            updateData.full_name = data.fullName;
        }
        if (data.birthDate) {
            updateData.birth_date = data.birthDate;
        }
        if (data.gender) {
            updateData.gender = data.gender;
        };
        if (data.phone) {
            updateData.phone = data.phone;
        }
        if (data.email) {
            updateData.email = data.email;
        }
        if (data.address) {
            updateData.address = data.address;
        }

        const driver = await prisma.drivers.update(
            {
                where: {
                    id: data.id
                },
                data: updateData,
                include: {
                    account: true
                },
            }
        );

        if (driver.account_id && (data.password || data.status)) {
            await AccountService.update({
                id: driver.account_id,
                password: data.password,
                status: data.status,
            });
        }

        return isPutRest({
            id: driver.id,
            avatar: driver.avatar,
            full_name: driver.full_name,
            birth_date: driver.birth_date,
            gender: driver.gender,
            phone: driver.phone,
            email: driver.email,
            address: driver.address,
            status: driver.account.status,
            account_id: driver.account.id,
            username: driver.account.username
        } as DriverResponse);
    },
}

export default DriverService;