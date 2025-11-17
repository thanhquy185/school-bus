import { Response, Request } from "express";
import ParentService from '../services/parent.service';
import { verifyToken } from "../utils/jwt.util";
import PickupService from "../services/pickup.service";

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
    },

    async getStudents(_req: Request, res: Response) {
        console.log(_req.headers.authorization)
        const response = await ParentService.getStudents(_req.headers.authorization);
        res.status(response.statusCode).json(response);
    },

    async getPickups(_req: Request, res: Response) {
        const response = await PickupService.getList();
        res.status(response.statusCode).json(response);
    },

    async updatePickupStudent(req: Request, res: Response) {
        const response = await ParentService.updatePickupStudent({ id: Number(req.params.id), ...req.body });
        res.status(response.statusCode).json(response);
    }
}

export default ParentController;
