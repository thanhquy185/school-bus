import { Response, Request } from "express";
import InformService from "../services/inform.service";

const InformController = {
  async getById(req: Request, res: Response) {
    const response = await InformService.getById({
      id: Number(req.params.id),
    });
    res.status(response.statusCode).json(response);
  },

  async getAll(_req: Request, res: Response) {
    const response = await InformService.getAll();
    res.status(response.statusCode).json(response);
  },

  async create(req: Request, res: Response) {
    const response = await InformService.create(req.body);
    res.status(response.statusCode).json(response);
  },

  async update(req: Request, res: Response) {
    const response = await InformService.update({
      id: Number(req.params.id),
      ...req.body,
    });
    res.status(response.statusCode).json(response);
  },

  async delete(req: Request, res: Response) {
    const response = await InformService.delete({
      id: req.params.id,
    });
    res.status(response.statusCode).json(response);
  },
};

export default InformController;
