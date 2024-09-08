"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connection = mysql2_1.default.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'ani@1234',
    database: process.env.DB_NAME || 'register'
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    }
    else {
        console.log('Connected to the database');
    }
});
exports.default = connection;
