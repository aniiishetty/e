import express from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import registrationRoutes from './routes/registrationRoutes';
import collegeRoutes from './routes/collegeRoutes';
import sequelize from './models/index'; // Import the Sequelize instance

dotenv.config();

const app = express();
const port = process.env.PORT || 3005; // Use environment variable for port, default to 3000

app.use(express.static(path.join("/home/ubuntu/e/frontend/build")));
app.get("/", (req, res) => {
  res.sendFile(path.join("/home/ubuntu/e/frontend/build/index.html"));
});

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json());

// Test database connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err: Error) => {
        console.error('Database connection error:', err);
        process.exit(1); // Exit process if database connection fails
    });

// Routes
app.use('/api/registrations', registrationRoutes);
app.use('/api/colleges', collegeRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
