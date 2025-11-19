import prisma from "../configs/prisma.config"
import { createSchema } from "../schemas/class.schema";
import { isGetRest } from "../utils/rest.util";

const ClassService = {
    async getAll() {
        const classes = await prisma.classes.findMany();
        return isGetRest(classes);
    },
    async create(input: any) {
        const data = createSchema.parse(input);
        const cls = await prisma.classes.create({
            data: {
                name: data.name
            }
        });
        return isGetRest({
            id: cls.id,
            name: cls.name
        });
    }
}

export default ClassService;