import { Response, Request } from "express";
import RouteService from "../services/route.service";

const RouteController = {
    async get(req: Request, res: Response) {
        const response = await RouteService.get({
            id: Number(req.params.id)
        });

        res.status(response.statusCode).json(response);
    },

    async getAll(_req: Request, res: Response) {
        const response = await RouteService.getAll();

        res.status(response.statusCode).json(response);
    },

    async create(req: Request, res: Response) {
        const response = await RouteService.create(req.body);
        
        res.status(response.statusCode).json(response);
    },

    async update(req: Request, res: Response) {
        const response = await RouteService.update({
            id: Number(req.params.id),
            ...req.body
        });

        res.status(response.statusCode).json(response);
    },

    async delete(req: Request, res: Response) {
        const response = await RouteService.delete({
            id: Number(req.params.id)
        });

        res.status(response.statusCode).json(response);
    }
};

export default RouteController;
