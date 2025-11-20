import { Request, Response } from "express";
import DriverService from "../services/driver.service";

const DriverController = {
    async getAll(_req: Request, res: Response) {
        const response = await DriverService.getAll();
        return res.json(response);
    },

    async getAllActive(_req: Request, res: Response) {
        const response = await DriverService.getAllActive();
        return res.json(response);
    },

    async uploadAvatar(_req: Request, res: Response) {
        const response = await DriverService.uploadAvatar(Number(_req.params.id), _req.file);
        return res.json(response);
    },

    async create(_req: Request, res: Response) {
        const response = await DriverService.create(_req.body);
        return res.json(response);
    },

    async update(_req: Request, res: Response) {
        const response = await DriverService.update({ id: Number(_req.params.id), ..._req.body });
        return res.json(response);
    },
    
    async getInfo(_req: Request, res: Response) {
        const response = await DriverService.getInfo(_req.headers.authorization);
        res.status(response.statusCode).json(response);
    },
}

export default DriverController;