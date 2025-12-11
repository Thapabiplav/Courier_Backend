const { Sequelize, DataTypes } = require("sequelize");
const { dbConfig } = require("../config/config");

const sequelize = new Sequelize(
  dbConfig.username,
  dbConfig.database,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: "mysql",
    pool: {
      max: dbConfig.max,
      min: dbConfig.min,
      acquire: dbConfig.acquire,
      idle: dbConfig.idle,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.error("database connection unsuccess", err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize
  .sync({
    alter: false,
  })
  .then(() => {
    console.log("database sync successfully");
  })
  .catch((err) => {
    console.log("database sync failed", err);
  });
