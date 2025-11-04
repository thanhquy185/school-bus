import ClassService from "../services/class.service";

const ClassController = {
    async getList(_req, res) {
        const response = await ClassService.getList();
        res.status(response.statusCode).json(response);
    },
    async create(req, res) {
        const response = await ClassService.create(req.body);
        res.status(response.statusCode).json(response);
    }
}

export default ClassController;