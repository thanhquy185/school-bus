import z from "zod";

export const registerSchema = z.object({
    username: z.string(),
    password: z.string(),
    passwordConfirm: z.string()
});

export const loginSchema = z.object({
    username: z.string().nonempty("Username is required"),
    password: z.string()
});