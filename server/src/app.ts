import express from 'express';
import { config } from 'dotenv';

import { RestResponse } from './dtos/RestResponse';
import { getConnection } from './utils/database';

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});


app.get('/', (req, res) => {
    const response: RestResponse<string> = {
        statusCode: 200,
        result: true,
        message: "Hello API",
        data: null,
        errorMessage: null
    }

    res.json(response);
});

getConnection();

app.listen(PORT, () => {
    console.log(`School Bus Management Server running on port ${PORT}`);
    console.log(`API available at: http://localhost:${PORT}`);
});

export default app;