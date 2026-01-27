import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads', 'profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: user_{userId}_{timestamp}.{ext}
    const userId = req.user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `user_${userId}_${timestamp}${ext}`;
    cb(null, filename);
  },
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter,
});

// Middleware for single profile image upload
export const uploadProfileImage = upload.single('profile_image');

// Helper function to delete old profile image
export const deleteProfileImage = (imagePath) => {
  if (!imagePath) return;
  
  // If it's a base64 string (old format), skip deletion
  if (imagePath.startsWith('data:image/')) {
    return;
  }
  
  // Extract filename from path (e.g., /uploads/profiles/user_1_123.jpg)
  const filename = path.basename(imagePath);
  const filePath = path.join(uploadsDir, filename);
  
  // Delete file if it exists
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted old profile image: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting old profile image: ${error.message}`);
    }
  }
};

// Get relative path for database storage
export const getImagePath = (filename) => {
  return `/uploads/profiles/${filename}`;
};
