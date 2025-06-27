import { Router } from 'express';
import multer from 'multer';
import { IconController } from '../controllers/IconController.js';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
    }
  }
});

// Upload route
router.post('/upload', upload.single('icon'), IconController.uploadIcon);

// Route to serve uploaded icons
router.get('/:filename', IconController.getUploadedIcon);

export default router;
