import { Response, Request } from "express";
import ActiveService from "../services/active.service";

const ActiveController = {
  async getById(req: Request, res: Response) {
    const response = await ActiveService.getById({
      id: Number(req.params.id),
    });
    res.status(response.statusCode).json(response);
  },

  async getAll(_req: Request, res: Response) {
    const response = await ActiveService.getAll();
    res.status(response.statusCode).json(response);
  },

   async getAllActive(_req: Request, res: Response) {
    const response = await ActiveService.getAllActive();
    res.status(response.statusCode).json(response);
  },

  async create(req: Request, res: Response) {
    const response = await ActiveService.create(req.body);
    res.status(response.statusCode).json(response);
  },

  async update(req: Request, res: Response) {
    const response = await ActiveService.update({
      id: Number(req.params.id),
      ...req.body,
    });
    res.status(response.statusCode).json(response);
  },
};

export default ActiveController;
