import Testimonial from '../models/Testimonial.js';

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching testimonials', error: err.message });
  }
};

export const addTestimonial = async (req, res) => {
  const { customerName, companyName, reviewText, rating } = req.body;
  if (!customerName || !companyName || !reviewText || !rating) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const testimonial = new Testimonial({ customerName, companyName, reviewText, rating });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: 'Error creating testimonial', error: err.message });
  }
};

export const editTestimonial = async (req, res) => {
  const { customerName, companyName, reviewText, rating } = req.body;
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found.' });

    if (customerName) testimonial.customerName = customerName;
    if (companyName) testimonial.companyName = companyName;
    if (reviewText) testimonial.reviewText = reviewText;
    if (rating !== undefined) testimonial.rating = rating;

    await testimonial.save();
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ message: 'Error updating testimonial', error: err.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found.' });
    res.json({ message: 'Testimonial deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting testimonial', error: err.message });
  }
};
