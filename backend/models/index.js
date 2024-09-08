"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registration = exports.College = void 0;
const College_1 = require("./College");
Object.defineProperty(exports, "College", { enumerable: true, get: function () { return College_1.College; } });
const Registration_1 = require("./Registration");
Object.defineProperty(exports, "Registration", { enumerable: true, get: function () { return Registration_1.Registration; } });
// Import and initialize Sequelize instance
const database_1 = __importDefault(require("../config/database"));
const models = { College: College_1.College, Registration: Registration_1.Registration };
// Set up associations
Object.values(models).forEach((model) => {
    if (typeof model.associate === 'function') {
        model.associate(models);
    }
});
exports.default = database_1.default;
