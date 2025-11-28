import prisma from "../configs/prisma.config";
import { BAD_CODE, BAD_MESSAGE } from "../configs/respose.config";
import { AuthenticationPayload } from "../middlewares/auth.middleware";
import { RestResponse } from "../responses/rest.response";
import { loginSchema } from "../schemas/auth.schema"
import { comparePassword } from "../utils/bcypt.util";
import { generateToken, verifyToken } from "../utils/jwt.util";
import { isGetRest } from "../utils/rest.util";

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

        // const isMatch = await comparePassword(data.password, account?.password || "");
        // if (!isMatch) {
        //     return {
        //         statusCode: BAD_CODE,
        //         result: false,
        //         message: BAD_MESSAGE,
        //         data: null,
        //         errorMessage: "Tài khoản hoặc mật khẩu không đúng"
        //     } as RestResponse;
        // }

        const auth = generateToken({ id: account.id, username: account.username, role: account.role });
        return isGetRest(auth);
    },

    async authConfig(authentication: string) {
        const payload: AuthenticationPayload = await verifyToken(authentication);
        return isGetRest({
            accessToken: authentication.replace("Bearer", "").trim(),
            role: payload.role,
            issuedAt: payload.iat,
            expiresAt: payload.exp
        });
    }
}


export default AuthService;