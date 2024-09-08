import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('Environment Variables:', {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_HOST: process.env.DB_HOST,
});

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: (msg) => console.log(msg),
  }
);

// Attempt to test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    return sequelize.sync({ alter: true }); // Synchronize the database schema with the models
  })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database or synchronize:', error);
  });

export default sequelize;
