import { Request, Response } from "express";
import AccountService from "../services/account.service";

const AccountController = {
    async get(_req: Request, res: Response) {
        const response = await AccountService.get({ id: Number(_req.params.id) });
        res.status(response.statusCode).json(response);
    },

    async create(_req: Request, res: Response) {
        const response = await AccountService.create(_req.body);
        res.status(response.statusCode).json(response);
    },

    async update(_req: Request, res: Response) {
        const response = await AccountService.update({ id: Number(_req.params.id), ..._req.body });
        res.status(response.statusCode).json(response);
    },

    async delete(_req: Request, res: Response) {
        const response = await AccountService.delete({ id: Number(_req.params.id) });
        res.status(response.statusCode).json(response);
    }
}

export default AccountController;