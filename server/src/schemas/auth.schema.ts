import z from "zod";

export const registerShema = z.object({
    username: z.string(),
    password: z.string().min(6),
    passwordConfirm: z.string().min(6)
});

export const loginShema = z.object({
    username: z.string(),
    password: z.string()
});