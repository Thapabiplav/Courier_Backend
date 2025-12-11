require("dotenv").config();

const envPort = {
  port: process.env.PORT_NUMBER,
};

const seederConfig = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

const secretConfig = {
  secretKey: process.env.SECRET_KEY,
};

const dbConfig = {
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

module.exports = {dbConfig,envPort,secretConfig,seederConfig}