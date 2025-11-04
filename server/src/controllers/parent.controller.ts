import { Response, Request } from "express";
import ParentService from '../services/parent.service';

const ParentController = {
    async getList(_req: Request, res: Response) {
        const response = await ParentService.getList();
        res.status(response.statusCode).json(response);
    },

    async update(req: Request, res: Response) {
        const response = await ParentService.update({ id: Number(req.params.id), ...req.body });
        res.status(response.statusCode).json(response);
    },

    async create(_req: Request, res: Response) {
        const response = await ParentService.create(_req.body, _req.file);
        res.status(response.statusCode).json(response);
    },

    async uploadAvatar(_req: Request, res: Response) {
        const response = await ParentService.uploadAvatar(Number(_req.params.id), _req.file!);
        res.status(response.statusCode).json(response);
    }
}

export default ParentController;
