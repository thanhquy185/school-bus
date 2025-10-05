import z from "zod";

export const createShema = z.object({
    username: z.string(),
    password: z.string(),
    passwordConfirm: z.string(),
    role_id: z.int()
});
