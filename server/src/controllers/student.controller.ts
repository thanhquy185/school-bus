import { Request, Response } from "express";
import StudentService from "../services/student.service";

const StudentController = {
    async getAll(_req: Request, res: Response) {
        const response = await StudentService.getAll();
        res.status(response.statusCode).json(response);
    },

    async getAllStudying(_req: Request, res: Response) {
        const response = await StudentService.getAllStudying();
        res.status(response.statusCode).json(response);
    },

    async create(_req: Request, res: Response) {
        const response = await StudentService.create(_req.body);
        res.status(response.statusCode).json(response);
    },

    async uploadAvatar(_req: Request, res: Response) {
        const response = await StudentService.uploadAvatar(
            _req.params.id,
            _req.file!
        );
        res.status(response.statusCode).json(response);
    },

    async update(_req: Request, res: Response) {
        const response = await StudentService.update({ id: _req.params.id, ..._req.body });
        res.status(response.statusCode).json(response);
    }
}

export default StudentController;