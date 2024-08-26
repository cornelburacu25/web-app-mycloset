const Sequelize = require("sequelize");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        pool: {
            max: 5,
            min: 0,
            acquire: 50000,
        },
        logging: true,
        schema: "mycloset",
    }
);

const models = {};
const modelFiles = fs.readdirSync(path.join(__dirname, "../models"));
modelFiles
  .filter((file) => file.endsWith(".js") && file !== "index.js")
  .forEach((file) => {
    const model = require(path.join(__dirname, "../models", file))(sequelize);
    models[model.name] = model;
  });

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

sequelize
  .sync()
  .then(() => {
    console.log("Models synchronized successfully.");
  })
  .catch((error) => {
    console.error("Unable to synchronize models:", error);
  });

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = {sequelize, ...models};