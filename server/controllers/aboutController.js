const About = require('../models/About');

exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.updateAbout = async (req, res) => {
  const { title, subtitle, description, stats } = req.body;

  try {
    let about = await About.findOneAndUpdate(
      {}, 
      { title, subtitle, description, stats, updatedAt: Date.now() }, 
      { new: true, upsert: true }
    );
    res.json(about);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

