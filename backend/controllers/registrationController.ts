import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { Buffer } from 'buffer';
import { Registration } from '../models/Registration';
import { College } from '../models/College';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';

// Define FileFields interface
interface FileFields {
    photo?: Express.Multer.File[];
    researchPaper?: Express.Multer.File[];
}

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Configure nodemailer with Hostinger
// Configure the email transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'lmsad6123@gmail.com',
    pass: 'xijxdmkupniydinn',
  },
});

// Middleware to handle file size errors
export const handleFileSizeError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size should not exceed 5MB' });
    }
    next(err); // Pass other errors to the default error handler
};

// Function to convert image buffer to a data URL
const bufferToDataURL = (buffer: Buffer, mimeType: string): string => {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
};

// Function to generate PDF from HTML
 const generatePDF = async (content: string): Promise<Buffer> => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    try {
        await page.setContent(content, { waitUntil: 'networkidle0' });
    } catch (contentError: any) {
        console.error('Error setting content:', contentError);
        throw new Error('Error setting content');
    }

    let pdfBuffer: Buffer;
    try {
        const pdfArrayBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '40px',
                right: '40px',
                bottom: '40px',
                left: '40px',
            },
        });
        // Convert Uint8Array to Buffer
        pdfBuffer = Buffer.from(pdfArrayBuffer);
    } catch (pdfError: any) {
        console.error('Error generating PDF:', pdfError);
        throw new Error('Error generating PDF');
    }

    await browser.close();

    return pdfBuffer;
};

export const registerUser = async (req: Request, res: Response) => {
    const { name, designation, collegeId, phone, email, reason, collegeName: newCollegeName, committeeMember } = req.body;
    const files = req.files as unknown as FileFields;
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

        const eventId = await Registration.count() + 1;
    const paddedEventId = eventId.toString().padStart(4, '0');

    const newRegistration = await Registration.create({
      name,
      designation,
      collegeId: designation === 'Council Member' ? null : college?.id,
      committeeMember: designation === 'Council Member' ? committeeMember : null,
      phone,
      email,
      photo: photo.buffer,
      reason,
      researchPaper: researchPaper?.buffer,
      eventId: parseInt(paddedEventId), // Assign the generated eventId
    });

    const confirmationMailOptions = {
      from: 'lmsad6123@gmail.com',
      to: 'lmsad6123@gmail.com',
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

  transporter.sendMail(confirmationMailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
      } else {
          console.log('Email sent:', info.response);
      }
  });
        // Convert the uploaded photo buffer to a data URL
        const photoDataURL = bufferToDataURL(photo.buffer, photo.mimetype);

        // Populate the HTML with user details
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Business Card</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }

            .business-card {
              width: 700px;
              height: 450px;
              background: linear-gradient(135deg, #1a73e8 50%, #0077b5 50%);
              color: #fff;
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
              position: relative;
              overflow: hidden;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            }

            .slanted-bg {
              width: 50%;
              background-color: #2b2d42;
              position: absolute;
              height: 100%;
              clip-path: polygon(0 0, 100% 0, 70% 100%, 0% 100%);
              z-index: 1;
            }

            .photo-container {
              z-index: 2;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 45%;
              padding-left: 30px;
            }

            .photo-container img {
              width: 200px;
              height: 200px;
              border-radius: 8px;
              border: 5px solid #1a73e8;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
              background-color: #fff;
            }

            .details-container {
              z-index: 2;
              width: 55%;
              padding: 40px 30px;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }

            .card-header {
              text-align: left;
            }

            .card-header h2 {
              margin: 0;
              font-size: 2.0rem;
              letter-spacing: 1px;
              font-weight: 700;
              color: #f0f0f0;
            }

            .card-header h3 {
              margin: 5px 0 ;
              font-size: 1.4rem;
              font-weight: 400;
              color: #f0f0f0;
            }

            .card-header h4 {
              margin: 5px 0 20px;
              font-size: 1.4rem;
              font-weight: 400;
              color: #f0f0f0;
            }

            .card-body {
              font-size: 1.1rem;
              color: #f0f0f0;
            }

            .card-body p {
              margin: 6px 0;
              display: flex;
              align-items: center;
            }

            .svg-icon {
              width: 20px;
              height: 20px;
              margin-right: 10px;
            }

            .logo-container {
      position: absolute;
      top: 10px;
      left: 60%; /* Move the logos further to the right */
      transform: translateX(-30%); /* Adjust the centering if needed */
      display: flex;
      justify-content: space-around;
      width: 250px;
    }
    
    .logo-container img:first-child {
      margin-left: 50px;
    }
    
    
    .logo-container img {
      width: 60px;
      height: auto;
    }


            /* Bottom logos */
            .bottom-logo-container {
              position: absolute;
              bottom: 10px;
              left: 68%;
              transform: translateX(-50%);
              display: flex;
              gap: 30px;
            }

            .bottom-logo-container img {
              width: 60px; /* Adjust this to match the size of top logos */
              height: auto;
            }
          </style>
        </head>
        <body>
          <div class="business-card">
            <div class="slanted-bg"></div>
            <div class="logo-container">
              <img src="https://iimstc.com/wp-content/uploads/2024/09/WhatsApp-Image-2024-09-02-at-12.25.43-PM-150x150.jpeg" alt="Logo 1">
              <img src="https://iimstc.com/wp-content/uploads/2024/09/WhatsApp-Image-2024-09-02-at-8.34.37-AM.jpeg" alt="Logo 2">
            </div>
            <div class="photo-container">
              <img src="${photoDataURL}" alt="User Photo">
            </div>
            <div class="details-container">
              <div class="card-header">
              <p style="text-align: right; font-weight: bold; font-size: 1.2rem;">Event ID: ${eventId}</p>
                <h2>${name}</h2>
                <h3>${designation}</h3>
                <h4>${college ? college.name : 'N/A'}</h4>
              </div>
              <div class="card-body">
                <p>
                  <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="10" height="10">
                    <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
                  </svg>
                  +91 9304080481
                </p>
                <p>
                  <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                    <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
                  </svg>
                  admin@iimstc.com
                </p>
               
              </div>
            </div>
            <div class="bottom-logo-container">
              <img src="https://www.ecindia.org/Fourth-comming-event/ECI-WB.png" alt="Bottom Logo">
              <img src="https://vectorseek.com/wp-content/uploads/2023/09/AICTE-Logo-Vector.svg-.png" alt="Bottom Logo">
              <img src="https://presentations.gov.in/wp-content/uploads/2020/06/UGC-Preview.png?x31571" alt="Bottom Logo">

            </div>
          </div>
        </body>
        </html>
        `;

       const pdfBuffer = await generatePDF(htmlContent);

        const mailOptions = {
            from: 'lmsad6123@gmail.com',
            to: 'lmsad6123@gmail.com',
            subject: 'Invitation Confirmation for "Diamond Beneath Your Feet" Event',
            text: `Respected ${name},

Greetings from the International Institute of Medical Science & Technology Council (IIMSTC).

Thank you for registering as a Special Guest/Guest at our upcoming international event, "Diamond Beneath Your Feet," on Monday, September 23, 2024, at Hotel Lalith Ashok, Bangalore, from 10 AM to 1 PM. This prestigious event will feature a major announcement about international internship opportunities for economically underprivileged Indian students, including stipends and scholarships.

An identity card is attached to this email. Please ensure you bring this ID for entry purposes. Kindly note, entry is exclusive to the registered guest, and nominees, proxy representatives, personal assistants, secretaries, or drivers will not be permitted in the hall.

We are honoured to welcome you to this event and look forward to hosting you.

Warm regards,
Welcome Committee`,
            attachments: [{
                filename: 'IDCard.pdf',
                content: pdfBuffer,
                encoding: 'base64'
            }]
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            res.status(500).json({ message: 'Error sending email' });
            return;
        }
        res.status(201).json({ message: 'User registered successfully and email sent with ID card.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
