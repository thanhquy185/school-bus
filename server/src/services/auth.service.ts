import prisma from "../configs/prisma.config";
import { BAD_CODE, BAD_MESSAGE } from "../configs/respose.config";
import { RestResponse } from "../responses/rest.response";
import { loginSchema } from "../schemas/auth.schema"
import { comparePassword } from "../utils/bcypt.util";
import { generateToken } from "../utils/jwt.util";

const AuthService = {
    async login(input: unknown) {
        const data = loginSchema.parse(input);
        const account = await prisma.accounts.findFirst({
            where: {
                username: data.username
            }
        });
         
        if (!account) {
            return {
                statusCode: BAD_CODE,
                result: false,
                message: BAD_MESSAGE,
                data: null,
                errorMessage: "Tài khoản không tồn tại"
            } as RestResponse;
        }

        const isMatch = await comparePassword(data.password, account?.password || "");
        if (!isMatch) {
            return {
                statusCode: BAD_CODE,
                result: false,
                message: BAD_MESSAGE,
                data: null,
                errorMessage: "Tài khoản hoặc mật khẩu không đúng"
            } as RestResponse;
        }

        const auth = generateToken({ id: account.id, username: account.username, role: account.role });
        return {
            statusCode: 200,
            result: true,
            message: "Đăng nhập thành công",
            data: auth,
            errorMessage: null
        } as RestResponse;
    }
}


export default AuthService;