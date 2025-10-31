import { Request, Response } from "express";
import StudentService from "../services/student.service";

const StudentController = {
    async getList(_req: Request, res: Response) {
        const response = await StudentService.getList();
        res.status(response.statusCode).json(response);
    },

    async create(_req: Request, res: Response) {
        const response = await StudentService.create(_req.body, _req.file);
        res.status(response.statusCode).json(response);
    }
}

export default StudentController;