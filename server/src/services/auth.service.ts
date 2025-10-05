import { prisma } from "../configs/prisma";
import { loginShema, registerShema } from "../schemas/auth.schema";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (input: any) => {
    const data = registerShema.parse(input);
    const existing = await prisma.users.findUnique({ where: { username: data.username } });
    if (existing) throw new Error("Tài khoản đã tồn tại");
    if (data.password !== data.passwordConfirm) throw new Error("Mật khẩu xác nhận không chính xác");
    const user = await prisma.users.create({
        data: {
            username: data.username,
            password: data.password,
            status: "ACTIVE"
        }
    });
    return { id: user.id, email: user.username };
}

export const login = async (input: any) => {
    const data = loginShema.parse(input);
    const user = await prisma.users.findUnique({ where: { username: data.username, password: data.password }});
    if (!user) throw new Error("Tài khoản hoặc mật khẩu không chính xác");
    return { id: user.id, email: user.username };
}