import ClassService from "../services/class.service";

const ClassController = {
    async getAll(_req, res) {
        const response = await ClassService.getAll();
        res.status(response.statusCode).json(response);
    },
    async create(req, res) {
        const response = await ClassService.create(req.body);
        res.status(response.statusCode).json(response);
    }
}

export default ClassController;