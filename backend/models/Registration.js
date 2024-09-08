"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registration = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const College_1 = require("./College"); // Import College model
class Registration extends sequelize_1.Model {
}
exports.Registration = Registration;
Registration.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    designation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    collegeId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Colleges', // Table name
            key: 'id',
        },
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    photo: {
        type: sequelize_1.DataTypes.BLOB('long'),
        allowNull: true,
    },
    reason: {
        type: sequelize_1.DataTypes.ENUM('To know about International Internship', 'To know about Textbook', 'To present research paper'),
        allowNull: false,
    },
    researchPaper: {
        type: sequelize_1.DataTypes.BLOB('long'), // Allows uploading files up to a certain size
        allowNull: true, // Only allow if reason is "To present research paper"
    },
}, {
    sequelize: database_1.default,
    tableName: 'registrations',
    timestamps: true,
});
Registration.belongsTo(College_1.College, { foreignKey: 'collegeId', as: 'college' });
