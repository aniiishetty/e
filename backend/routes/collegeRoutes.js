"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const collegeController_1 = require("../controllers/collegeController");
const router = express_1.default.Router();
router.post('/add', collegeController_1.addCollege);
router.get('/', collegeController_1.getAllColleges);
router.get('/check-college/:collegeId', collegeController_1.checkCollegeRegistration);
router.get('/colleges/search', collegeController_1.getAllColleges);
exports.default = router;
