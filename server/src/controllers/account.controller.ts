import { Request, Response } from "express";
import AccountService from "../services/account.service";

const AccountController = {
    async get(_req: Request, res: Response) {
        const respose = await AccountService.get({ id: Number(_req.params.id) });
        res.status(respose.statusCode).json(respose);
    },

    async create(_req: Request, res: Response) {
        const respose = await AccountService.create(_req.body);
        res.status(respose.statusCode).json(respose);
    },

    async update(_req: Request, res: Response) {
        const respose = await AccountService.update({ id: Number(_req.params.id), ..._req.body });
        res.status(respose.statusCode).json(respose);
    },

    async delete(_req: Request, res: Response) {
        const respose = await AccountService.delete({ id: Number(_req.params.id) });
        res.status(respose.statusCode).json(respose);
    }
}

export default AccountController;