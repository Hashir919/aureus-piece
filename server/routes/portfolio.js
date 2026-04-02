const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', portfolioController.getPortfolio);
router.post('/', auth, upload.single('image'), (req, res, next) => {
  if (req.file) req.body.image = req.file.path;
  portfolioController.createPortfolio(req, res, next);
});
router.put('/:id', auth, upload.single('image'), (req, res, next) => {
  if (req.file) req.body.image = req.file.path;
  portfolioController.updatePortfolio(req, res, next);
});
router.delete('/:id', auth, portfolioController.deletePortfolio);

module.exports = router;
