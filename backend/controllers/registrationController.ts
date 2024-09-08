import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { Registration } from '../models/Registration';
import { College } from '../models/College';
import nodemailer from 'nodemailer';

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
export const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Configure nodemailer with Hostinger
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // Use SSL/TLS
    auth: {
        user: 'admin@iimstc.com', // Replace with your Hostinger email address
        pass: 'Admin@iimstc123#', // Replace with your Hostinger email password
    },
});

interface FileFields {
    photo?: Express.Multer.File[];
    researchPaper?: Express.Multer.File[];
}

// Middleware to handle file size errors
export const handleFileSizeError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size should not exceed 5MB' });
    }
    next(err); // Pass other errors to the default error handler
};

export const registerUser = async (req: Request, res: Response) => {
    const { name, designation, collegeId, phone, email, reason, collegeName: newCollegeName, committeeMember } = req.body;
    const files = req.files as FileFields; 
    const photo = files?.photo?.[0];
    const researchPaper = files?.researchPaper?.[0];

    try {
        // Validate required fields
        if (!name || !designation || !phone || !email || !reason) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate photo
        if (!photo) {
            return res.status(400).json({ message: 'Photo is required' });
        }

        let college = null;
        if (designation === 'Chair Person' || designation === 'Principal') {
            if (!collegeId) {
                return res.status(400).json({ message: 'College ID is required for this designation' });
            }
            college = await College.findByPk(collegeId);
            if (!college) {
                return res.status(400).json({ message: 'Invalid college ID' });
            }
        } else if (designation === 'Vice-Chancellor') {
            if (!newCollegeName) {
                return res.status(400).json({ message: 'College name is required for Vice-Chancellor' });
            }
            const existingCollege = await College.findOne({ where: { name: newCollegeName } });
            if (existingCollege) {
                college = existingCollege;
            } else {
                college = await College.create({ name: newCollegeName });
            }
        } else if (designation === 'Council Member') {
            // No college or committeeMember validation needed
        } else {
            return res.status(400).json({ message: 'Invalid designation' });
        }

        const existingUser = await Registration.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        if (photo.size > 5 * 1024 * 1024) {
            return res.status(400).json({ message: 'Photo size should not exceed 5 MB' });
        }

        const newRegistration = await Registration.create({
            name,
            designation,
            collegeId: designation === 'Council Member' ? null : college?.id,
            committeeMember: designation === 'Council Member' ? committeeMember : null,
            phone,
            email,
            photo: photo.buffer, // No change needed here
            reason,
            researchPaper: researchPaper?.buffer
        });

        const mailOptions = {
            from: 'admin@iimstc.com',
            to: 'admin@iimstc.com',
            subject: 'New Registration',
            text: `A new user has registered with the following details:

Name: ${name}
Designation: ${designation}
${designation === 'Council Member' ? `Committee Member: ${committeeMember || 'IIMSTC Council Member'}` : `College: ${college ? college.name : 'N/A'}`}
Phone: ${phone}
Email: ${email}
Reason: ${reason}`,
            attachments: [
                {
                    filename: 'photo.jpg',
                    content: photo.buffer,
                    encoding: 'base64'
                },
                ...(researchPaper ? [{
                    filename: 'research_paper.pdf',
                    content: researchPaper.buffer,
                    encoding: 'base64'
                }] : [])
            ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(201).json({ message: 'User registered successfully', id: newRegistration.id });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
