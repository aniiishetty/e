import { Request, Response } from 'express';
import { College } from '../models/College';
import {Registration} from '../models/Registration';
import { Op } from 'sequelize'; // For using Sequelize operators

// Add a new college
export const addCollege = async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ error: 'College name is required' });
        }
        const newCollege = await College.create({ name });
        res.status(201).json({ message: 'College added successfully', id: newCollege.id });
    } catch (err) {
        console.error('Error adding college:', err);
    
        if (err instanceof Error && err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'College already exists' });
        } else {
            res.status(500).json({ error: 'Database insertion error' });
        }
    }
};    

// Get all colleges with optional search
export const getAllColleges = async (req: Request, res: Response) => {
    const search = req.query.search ? { name: { [Op.iLike]: `%${req.query.search}%` } } : {};

    try {
        const colleges = await College.findAll({ where: search });
        res.status(200).json(colleges);
    } catch (err) {
        console.error('Error fetching colleges:', err);
        res.status(500).json({ error: 'Database query error' });
    }
};
export const checkCollegeRegistration = async (req: Request, res: Response) => {
    const { collegeId } = req.params;

    try {
        const registration = await Registration.findOne({ where: { collegeId } });

        if (registration) {
            res.status(200).json({ isRegistered: true, message: 'College is already registered by another user.' });
        } else {
            res.status(200).json({ isRegistered: false, message: 'College is not yet registered.' });
        }
    } catch (err) {
        console.error('Error checking college registration:', err);
        res.status(500).json({ error: 'Database query error' });
    }
};
