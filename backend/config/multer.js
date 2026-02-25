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

// --- Complaint attachments ---
const complaintsDir = path.join(__dirname, '..', 'uploads', 'complaints');
if (!fs.existsSync(complaintsDir)) {
  fs.mkdirSync(complaintsDir, { recursive: true });
}

const complaintsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, complaintsDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || '';
    const safeName = (file.originalname || 'file').replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 50);
    const filename = `complaint_${userId}_${timestamp}_${safeName}${ext}`;
    cb(null, filename);
  },
});

const complaintsFileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, GIF, WebP) and PDF are allowed'), false);
  }
};

export const uploadComplaintAttachments = multer({
  storage: complaintsStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: complaintsFileFilter,
}).array('attachments', 5);

// --- Units import (XLSX, XML, CSV) ---
const unitsImportDir = path.join(__dirname, '..', 'uploads', 'units-import');
if (!fs.existsSync(unitsImportDir)) {
  fs.mkdirSync(unitsImportDir, { recursive: true });
}

const unitsImportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, unitsImportDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = (path.extname(file.originalname) || '').toLowerCase();
    const filename = `units_import_${userId}_${timestamp}${ext}`;
    cb(null, filename);
  },
});

const ALLOWED_UNITS_IMPORT_MIMES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls (legacy)
  'text/csv',
  'application/csv',
  'text/plain', // CSV often sent as text/plain
  'application/xml',
  'text/xml',
];

const unitsImportFileFilter = (req, file, cb) => {
  const ext = (path.extname(file.originalname) || '').toLowerCase();
  const allowedExt = ['.xlsx', '.xls', '.csv', '.xml'];
  if (allowedExt.includes(ext) || ALLOWED_UNITS_IMPORT_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only XLSX, XML, and CSV files are allowed for unit import'), false);
  }
};

export const uploadUnitsImport = multer({
  storage: unitsImportStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: unitsImportFileFilter,
}).single('file');

// --- Invoice payment proof (screenshot/document) ---
const invoicePaymentProofDir = path.join(__dirname, '..', 'uploads', 'invoice-payment-proofs');
if (!fs.existsSync(invoicePaymentProofDir)) {
  fs.mkdirSync(invoicePaymentProofDir, { recursive: true });
}

const invoicePaymentProofStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, invoicePaymentProofDir);
  },
  filename: (req, file, cb) => {
    const invoiceId = req.params?.id || 'unknown';
    const userId = req.user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = (path.extname(file.originalname) || '').toLowerCase() || '.jpg';
    const filename = `invoice_${invoiceId}_user_${userId}_${timestamp}${ext}`;
    cb(null, filename);
  },
});

const invoicePaymentProofFileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, GIF, WebP) and PDF are allowed'), false);
  }
};

export const uploadInvoicePaymentProof = multer({
  storage: invoicePaymentProofStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: invoicePaymentProofFileFilter,
}).single('file');
