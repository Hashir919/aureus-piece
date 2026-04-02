const Portfolio = require('../models/Portfolio');
const cloudinary = require('../config/cloudinary');

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find().sort({ createdAt: -1 });
    res.json(portfolio);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.createPortfolio = async (req, res) => {
  const { title, description, image, category, year } = req.body;

  try {
    const newPortfolio = new Portfolio({
      title,
      description,
      image,
      category,
      year
    });

    const portfolio = await newPortfolio.save();
    res.json(portfolio);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.updatePortfolio = async (req, res) => {
  const { title, description, image, category, year } = req.body;

  try {
    let portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });

    portfolio.title = title || portfolio.title;
    portfolio.description = description || portfolio.description;
    portfolio.image = image || portfolio.image;
    portfolio.category = category || portfolio.category;
    portfolio.year = year || portfolio.year;

    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });

    await portfolio.deleteOne();
    res.json({ msg: 'Portfolio removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
