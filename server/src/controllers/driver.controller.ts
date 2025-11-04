import { Response, Request } from "express";
import DriverService from "../services/driver.service";

const DriverController = {
  async get(req: Request, res: Response) {
    const response = await DriverService.get({
      id: Number(req.params.id),
    });
    res.status(response.statusCode).json(response);
  },

  async getList(req: Request, res: Response) {
    const response = await DriverService.getList();

    res.status(response.statusCode).json(response);
  },

  async update(req: Request, res: Response) {
    const response = await DriverService.update({
      id: Number(req.params.id),
      ...req.body,
    });

    res.status(response.statusCode).json(response);
  },

  async create(req: Request, res: Response) {
    const response = await DriverService.create(req.body, req.file);

    res.status(response.statusCode).json(response);
  },

  async uploadAvatar(_req: Request, res: Response) {
    const response = await DriverService.uploadAvatar(
      Number(_req.params.id),
      _req.file!
    );
    res.status(response.statusCode).json(response);
  },

  async deleteDriver(req: Request, res: Response) {
    const response = await DriverService.deleteDriver({
      id: req.params.id,
    });

    res.status(response.statusCode).json(response);
  },
};

export default DriverController;
