import { Response, Request } from "express";
import ScheduleService from '../services/schedule.service';

const ScheduleController = {
    async get(req: Request, res: Response) {
        const response = await ScheduleService.get(
            { 
                id: Number(req.params.id) 
            }
        );

        res.status(response.statusCode).json(response);
    },

    async getAll(_req: Request, res: Response) {
        const response = await ScheduleService.getAll();

        res.status(response.statusCode).json(response);
    },

    async getAllActive(_req: Request, res: Response) {
        const response = await ScheduleService.getAllActive();

        res.status(response.statusCode).json(response);
    },

    async create(req: Request, res: Response) {
        const response = await ScheduleService.create(req.body);

        res.status(response.statusCode).json(response);
    },

    async update(req: Request, res: Response) {
        const response = await ScheduleService.update(
            {
                id: Number(req.params.id),
                ...req.body
            
            }
        );

        res.status(response.statusCode).json(response);
    },

    async delete(req: Request, res: Response) {
        const response = await ScheduleService.delete(
            {
                id: req.params.id
            }
        );

        res.status(response.statusCode).json(response);
    }
}

export default ScheduleController