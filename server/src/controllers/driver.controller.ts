import { Request, Response } from "express";
import DriverService from "../services/driver.service";

const DriverController = {
    async getList(_req: Request, res: Response) {
        const response = await DriverService.getList();
        return res.json(response);
    },

    async getByAccount(_req: Request, res: Response) {
        const respone = await DriverService.getByAccount(_req.headers.authorization);
        return res.json(respone);
    },

    async create(_req: Request, res: Response) {
        const response = await DriverService.create(_req.body);
        return res.json(response);
    },

    async uploadAvatar(_req: Request, res: Response) {
        const response = await DriverService.uploadAvatar(Number(_req.params.id), _req.file);
        return res.json(response);
    },

    async update(_req: Request, res: Response) {
        const response = await DriverService.update({ id: Number(_req.params.id), ..._req.body });
        return res.json(response);
    }
}

export default DriverController;