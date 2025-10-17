import { Response, Request } from "express";
import PickupService from '../services/pickup.service';

const PickupController = {
    async get(req: Request, res: Response) {
        const response = await PickupService.get(
            { 
                id: Number(req.params.id) 
            }
        );

        res.status(response.statusCode).json(response);
    },

    async getAll(_req: Request, res: Response) {
        const response = await PickupService.getAll();

        res.status(response.statusCode).json(response);
    },

    async create(req: Request, res: Response) {
        const response = await PickupService.create(req.body);

        res.status(response.statusCode).json(response);
    },

    async update(req: Request, res: Response) {
        const response = await PickupService.update(
            {
                id: Number(req.params.id),
                ...req.body
            }
        );

        res.status(response.statusCode).json(response);
    },

    async delete(req: Request, res: Response) {
        const response = await PickupService.delete(
            {
                id: req.params.id
            }
        );

        res.status(response.statusCode).json(response);
    }
}

export default PickupController