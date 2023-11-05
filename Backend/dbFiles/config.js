require('dotenv').config(); // Load environment variables from .env

const connectionConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true,
        trustedConnection: true,
        enableArithAbort: true,
        instancename: 'SQLEXPRESS',
        encrypt: true, // Use this option if you're connecting to Azure SQL Database
    },
    port: 1433
};

module.exports = connectionConfig;