const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createError } = require('./error.middleware');

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(createError(400, 'Only JPEG, PNG, or WebP images are allowed'));
};

const createUpload = (subfolder) => {
  const dest = path.join(__dirname, `../../uploads/${subfolder}`);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const storage = multer.diskStorage({
    destination: dest,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  });

  return multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });
};

module.exports = { avatarUpload: createUpload('avatars'), doctorUpload: createUpload('doctors') };
