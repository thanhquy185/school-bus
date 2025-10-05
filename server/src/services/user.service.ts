import { createShema } from "../schemas/user.scheme"

export const create = async(input: any) => {
    const data = createShema.parse(input);
    // ... Do somethings
}