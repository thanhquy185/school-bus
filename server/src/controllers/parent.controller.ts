import { Response, Request } from "express";
import ParentService  from '../services/parent.service';

const ParentController = {
        async getAll(_req: Request, res: Response) {
        const response = await ParentService.getAll();

        res.status(response.statusCode).json(response);
    },

        async get(req: Request, res: Response) {
        const response = await ParentService.get(
            { 
                id: Number(req.params.id) 
            }
        );

        res.status(response.statusCode).json(response);
    },
        async update(req: Request, res: Response) {
        const response = await ParentService.update(
            {
                
                id: Number(req.params.id),
                ...req.body
            }
        );


        res.status(response.statusCode).json(response);
    },
    
    async create(req: Request, res: Response) {
        const response = await ParentService.create(req.body);

        res.status(response.statusCode).json(response);
    },

        
}

export default ParentController;
