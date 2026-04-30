const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateProfile } = require('../validators/user.validator');
const { avatarUpload } = require('../middlewares/upload.middleware');

router.use(protect);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfile), userController.updateProfile);
router.post('/profile/avatar', avatarUpload.single('avatar'), userController.uploadAvatar);
router.delete('/profile/avatar', userController.deleteAvatar);
router.delete('/profile', userController.deleteAccount);

module.exports = router;
