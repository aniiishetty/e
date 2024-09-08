import multer from 'multer';

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;
