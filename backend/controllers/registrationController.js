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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const Registration_1 = require("../models/Registration");
const College_1 = require("../models/College");
const multer_1 = __importDefault(require("multer"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Configure multer to handle file uploads
// Configure multer to handle file uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
// Configure nodemailer with Gmail
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: {
        user: 'anishetty391@gmail.com',
        pass: 'dbaqgxwsxmajreyt',
    },
});
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { name, designation, collegeId, phone, email, reason } = req.body;
    const files = req.files; // Cast to the FileFields interface
    const photo = (_b = (_a = files === null || files === void 0 ? void 0 : files.photo) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.buffer; // Get photo buffer from request
    const researchPaper = (_d = (_c = files === null || files === void 0 ? void 0 : files.researchPaper) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.buffer; // Get research paper buffer from request
    try {
        // Check if the email already exists
        const existingUser = yield Registration_1.Registration.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Check if the collegeId is already registered
        const existingCollegeUser = yield Registration_1.Registration.findOne({ where: { collegeId } });
        if (existingCollegeUser) {
            const college = yield College_1.College.findByPk(collegeId);
            const collegeName = college ? college.name : 'Unknown College';
            return res.status(400).json({
                message: `The college ${collegeName} is already registered by another user. Please contact support if this is a mistake.`
            });
        }
        // Get the college name from the college table
        const college = yield College_1.College.findByPk(collegeId);
        const collegeName = college ? college.name : 'Unknown College';
        // Insert the new registration
        const newRegistration = yield Registration_1.Registration.create({
            name,
            designation,
            collegeId,
            phone,
            email,
            photo,
            reason,
            researchPaper
        });
        // Send confirmation email to the user
        const userMailOptions = {
            from: 'anishetty391@gmail.com',
            to: email,
            subject: 'Registration Confirmation',
            text: `
                Hello ${name},

                Thank you for registering with us!

                Here are the details of your registration:
                Name: ${name}
                Designation: ${designation}
                College: ${collegeName}
                Phone: ${phone}
                Email: ${email}
                Reason: ${reason}

                If you have any questions, feel free to reach out.

                Best regards,
                Your Company Name
            `
        };
        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email to user:', error);
            }
            else {
                console.log('Confirmation email sent to user:', info.response);
            }
        });
        // Send email to the representative with the user's photo and research paper if available
        const repMailOptions = {
            from: 'anishetty391@gmail.com',
            to: 'aniiivocal456@gmail.com',
            subject: 'New Registration',
            text: `
                A new user has registered with the following details:

                Name: ${name}
                Designation: ${designation}
                College: ${collegeName}
                Phone: ${phone}
                Email: ${email}
                Reason: ${reason}

                Please find the attached photo of the user.
            `,
            attachments: [
                {
                    filename: 'photo.jpg',
                    content: photo,
                    encoding: 'base64'
                },
                ...(researchPaper ? [{
                        filename: 'research_paper.pdf',
                        content: researchPaper,
                        encoding: 'base64'
                    }] : [])
            ]
        };
        transporter.sendMail(repMailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email to representative:', error);
            }
            else {
                console.log('Email sent to representative:', info.response);
            }
        });
        res.status(201).json({ message: 'User registered successfully', id: newRegistration.id });
    }
    catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.registerUser = registerUser;
