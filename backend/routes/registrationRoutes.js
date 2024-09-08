"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("../middleware/upload")); // Adjust the path if needed
const registrationController_1 = require("../controllers/registrationController");
const router = express_1.default.Router();
// Apply the upload middleware to handle file uploads
router.post('/register', upload_1.default.fields([{ name: 'photo', maxCount: 1 }, { name: 'researchPaper', maxCount: 1 }]), registrationController_1.registerUser);
exports.default = router;
