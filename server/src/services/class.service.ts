import prisma from "../configs/prisma.config"
import { createSchema } from "../schemas/class.schema";
import { isGetRest } from "../utils/rest.util";

const ClassService = {
    async getList() {
        const classes = await prisma.classes.findMany();
        return isGetRest(classes.map(cls => ({
            id: cls.id,
            name: cls.name
        })));
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