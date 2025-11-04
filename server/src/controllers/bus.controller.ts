import { Response, Request } from "express";
import BusService from '../services/bus.service';

const BusController = {

    async getList(_req: Request, res: Response) {
        const response = await BusService.getList();
        res.status(response.statusCode).json(response);
    },

    async create(req: Request, res: Response) {
        const response = await BusService.create(req.body);

        res.status(response.statusCode).json(response);
    },

    async update(req: Request, res: Response) {
        const response = await BusService.update(
            {
                id: Number(req.params.id),
                ...req.body
            }
        );

        res.status(response.statusCode).json(response);
    }
}

export default BusController