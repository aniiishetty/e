"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const registrationRoutes_1 = __importDefault(require("./routes/registrationRoutes"));
const collegeRoutes_1 = __importDefault(require("./routes/collegeRoutes"));
const index_1 = __importDefault(require("./models/index")); // Import the Sequelize instance
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000; // Use environment variable for port, default to 3000
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Test database connection
index_1.default.authenticate()
    .then(() => {
    console.log('Database connected successfully');
})
    .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit process if database connection fails
});
// Routes
app.use('/api/registrations', registrationRoutes_1.default);
app.use('/api/colleges', collegeRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    // Log the error
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    // Send a generic error message to the client
    res.status(500).json({ message: 'Internal Server Error' });
});
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
