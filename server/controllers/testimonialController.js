const Testimonial = require('../models/Testimonial');

exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.createTestimonial = async (req, res) => {
  const { name, role, content } = req.body;

  try {
    const newTestimonial = new Testimonial({
      name,
      role,
      content
    });

    const testimonial = await newTestimonial.save();
    res.json(testimonial);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.updateTestimonial = async (req, res) => {
  const { name, role, content } = req.body;

  try {
    let testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ msg: 'Testimonial not found' });

    testimonial.name = name || testimonial.name;
    testimonial.role = role || testimonial.role;
    testimonial.content = content || testimonial.content;

    await testimonial.save();
    res.json(testimonial);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    let testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ msg: 'Testimonial not found' });

    await testimonial.deleteOne();
    res.json({ msg: 'Testimonial removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
