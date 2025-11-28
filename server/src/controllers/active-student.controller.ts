import { Response, Request } from "express";
import ActiveStudentService from "../services/active-student.service";

const ActiveStudentController = {
  async getAll(_req: Request, res: Response) {
    const response = await ActiveStudentService.getAll();
    res.status(response.statusCode).json(response);
  },

  async create(req: Request, res: Response) {
    const response = await ActiveStudentService.create(req.body);
    res.status(response.statusCode).json(response);
  },

  async update(req: Request, res: Response) {
    const response = await ActiveStudentService.update(req.body);
    res.status(response.statusCode).json(response);
  },

  async scan(req: Request, res: Response) {
    const response = await ActiveStudentService.scan(req.body);
    res.status(response.statusCode).json(response);
  },
};

export default ActiveStudentController;
