import multer from 'multer';
import path from 'path';

// Configure multer for memory storage (no disk writes needed)
const storage = multer.memoryStorage();

// File filter to only allow PDF and TXT files
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'text/plain'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimes.includes(file.mimetype) || ext === '.pdf' || ext === '.txt') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and TXT files are allowed'), false);
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});


