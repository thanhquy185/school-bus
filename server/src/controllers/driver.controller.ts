import { Response, Request } from "express";
import DriverService from "../services/driver.service";

const DriverController = {
  async getDriver(req: Request, res: Response) {
    const response = await DriverService.getDriver({
      id: Number(req.params.id),
    });
    res.status(response.statusCode).json(response);
  },

  async getAllDrivers(req: Request, res: Response) {
    const response = await DriverService.getAllDrivers();

    res.status(response.statusCode).json(response);
  },

  async updateDriver(req: Request, res: Response) {
    const response = await DriverService.updateDriver({
      id: Number(req.params.id),
      ...req.body,
    });

    res.status(response.statusCode).json(response);
  },

  async createDriver(req: Request, res: Response) {
    const response = await DriverService.createDriver(req.body);

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
