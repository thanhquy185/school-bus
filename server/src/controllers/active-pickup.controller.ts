import { Response, Request } from "express";
import ActivePickupService from "../services/active-pickup.service";

const ActivePickupController = {
  async getAll(_req: Request, res: Response) {
    const response = await ActivePickupService.getAll();
    res.status(response.statusCode).json(response);
  },

  async create(req: Request, res: Response) {
    const response = await ActivePickupService.create(req.body);
    res.status(response.statusCode).json(response);
  },

  async update(req: Request, res: Response) {
    const response = await ActivePickupService.update(req.body);
    res.status(response.statusCode).json(response);
  },
};

export default ActivePickupController;
