const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const auth = require('../middleware/auth');

router.get('/', aboutController.getAbout);
router.put('/', auth, aboutController.updateAbout);

module.exports = router;
