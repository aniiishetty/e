"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCollegeRegistration = exports.getAllColleges = exports.addCollege = void 0;
const College_1 = require("../models/College");
const Registration_1 = require("../models/Registration");
const sequelize_1 = require("sequelize"); // For using Sequelize operators
// Add a new college
const addCollege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ error: 'College name is required' });
        }
        const newCollege = yield College_1.College.create({ name });
        res.status(201).json({ message: 'College added successfully', id: newCollege.id });
    }
    catch (err) {
        console.error('Error adding college:', err);
        if (err instanceof Error && err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'College already exists' });
        }
        else {
            res.status(500).json({ error: 'Database insertion error' });
        }
    }
});
exports.addCollege = addCollege;
// Get all colleges with optional search
const getAllColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search ? { name: { [sequelize_1.Op.iLike]: `%${req.query.search}%` } } : {};
    try {
        const colleges = yield College_1.College.findAll({ where: search });
        res.status(200).json(colleges);
    }
    catch (err) {
        console.error('Error fetching colleges:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});
exports.getAllColleges = getAllColleges;
const checkCollegeRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collegeId } = req.params;
    try {
        const registration = yield Registration_1.Registration.findOne({ where: { collegeId } });
        if (registration) {
            res.status(200).json({ isRegistered: true, message: 'College is already registered by another user.' });
        }
        else {
            res.status(200).json({ isRegistered: false, message: 'College is not yet registered.' });
        }
    }
    catch (err) {
        console.error('Error checking college registration:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});
exports.checkCollegeRegistration = checkCollegeRegistration;
