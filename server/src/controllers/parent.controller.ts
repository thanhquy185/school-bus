import { Response, Request } from "express";
import ParentService from '../services/parent.service';

const ParentController = {
    async getAll(_req: Request, res: Response) {
        const response = await ParentService.getAll();
        res.status(response.statusCode).json(response);
    },
    
    async getAllActive(_req: Request, res: Response) {
        const response = await ParentService.getAllActive();
        res.status(response.statusCode).json(response);
    },

    async uploadAvatar(_req: Request, res: Response) {
        const response = await ParentService.uploadAvatar(Number(_req.params.id), _req.file!);
        res.status(response.statusCode).json(response);
    },

    async create(_req: Request, res: Response) {
        const response = await ParentService.create(_req.body, _req.file);
        res.status(response.statusCode).json(response);
    },

    async update(req: Request, res: Response) {
        const response = await ParentService.update({ id: Number(req.params.id), ...req.body });
        res.status(response.statusCode).json(response);
    },

    async getInfo(_req: Request, res: Response) {
        const response = await ParentService.getInfo(_req.headers.authorization);
        res.status(response.statusCode).json(response);
    },

    async getStudents(_req: Request, res: Response) {
        const response = await ParentService.getStudents(_req.headers.authorization);
        res.status(response.statusCode).json(response);
    },
}

export default ParentController;
