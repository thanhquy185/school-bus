import mysql from 'mysql2/promise';

const getConnection = async() => {
    const connection = await mysql.createConnection({
        host: process.env.HOST_DB,
        port: parseInt(process.env.HOST_DB),
        database: process.env.NAME_DB,
        user: process.env.USER_DB,
        password: process.env.PASS_DB
    });

    return connection;
}

export { getConnection }