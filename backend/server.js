import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Models
import Admin from './models/Admin.js';
import Inquiry from './models/Inquiry.js';
import Solution from './models/Solution.js';
import Project from './models/Project.js';
import Article from './models/Article.js';
import Event from './models/Event.js';
import Gallery from './models/Gallery.js';
import Testimonial from './models/Testimonial.js';

// Auth Middleware
import { auth } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ai_solutions_default_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// ==========================================
// 1. AUTHENTICATION & SETTINGS ROUTES
// ==========================================

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// Get Profile Details
app.get('/api/auth/profile', auth, async (req, res) => {
  res.json({
    id: req.admin._id,
    username: req.admin.username,
    email: req.admin.email
  });
});

// Update Profile / Settings
app.put('/api/auth/profile', auth, async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });

    if (username) admin.username = username;
    if (email) admin.email = email;
    if (password) admin.password = password; // Will trigger bcrypt pre-save hook

    await admin.save();
    res.json({
      message: 'Profile updated successfully.',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

// ==========================================
// 2. INQUIRY ROUTES
// ==========================================

// Submit inquiry (Public)
app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, companyName, country, jobTitle, jobDetails } = req.body;
  
  if (!name || !email || !phone || !country || !jobDetails) {
    return res.status(400).json({ message: 'Please provide all required fields (Name, Email, Phone, Country, Job Details).' });
  }

  try {
    const newInquiry = new Inquiry({
      name,
      email,
      phone,
      companyName,
      country,
      jobTitle,
      jobDetails
    });
    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully.', data: newInquiry });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting inquiry', error: err.message });
  }
});

// Get all inquiries (Admin)
app.get('/api/inquiries', auth, async (req, res) => {
  const { search } = req.query;
  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { jobDetails: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inquiries', error: err.message });
  }
});

// Get inquiry details (Admin)
app.get('/api/inquiries/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inquiry details', error: err.message });
  }
});

// Delete Inquiry (Admin)
app.delete('/api/inquiries/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    res.json({ message: 'Inquiry deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting inquiry', error: err.message });
  }
});

// ==========================================
// 3. SOLUTIONS / SERVICES ROUTES
// ==========================================

// Get all solutions (Public)
app.get('/api/solutions', async (req, res) => {
  try {
    const solutions = await Solution.find().sort({ createdAt: -1 });
    res.json(solutions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching solutions', error: err.message });
  }
});

// Add solution (Admin)
app.post('/api/solutions', auth, async (req, res) => {
  const { title, description, icon, details } = req.body;
  if (!title || !description || !icon) {
    return res.status(400).json({ message: 'Title, description, and icon are required.' });
  }
  try {
    const solution = new Solution({ title, description, icon, details });
    await solution.save();
    res.status(201).json(solution);
  } catch (err) {
    res.status(500).json({ message: 'Error creating solution', error: err.message });
  }
});

// Edit solution (Admin)
app.put('/api/solutions/:id', auth, async (req, res) => {
  const { title, description, icon, details } = req.body;
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ message: 'Solution not found.' });
    
    if (title) solution.title = title;
    if (description) solution.description = description;
    if (icon) solution.icon = icon;
    if (details) solution.details = details;

    await solution.save();
    res.json(solution);
  } catch (err) {
    res.status(500).json({ message: 'Error updating solution', error: err.message });
  }
});

// Delete solution (Admin)
app.delete('/api/solutions/:id', auth, async (req, res) => {
  try {
    const solution = await Solution.findByIdAndDelete(req.params.id);
    if (!solution) return res.status(404).json({ message: 'Solution not found.' });
    res.json({ message: 'Solution deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting solution', error: err.message });
  }
});

// ==========================================
// 4. PROJECTS / CASE STUDIES ROUTES
// ==========================================

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
});

app.post('/api/projects', auth, async (req, res) => {
  const { title, description, imageUrl, clientName, date, details } = req.body;
  if (!title || !description || !imageUrl) {
    return res.status(400).json({ message: 'Title, description, and image URL are required.' });
  }
  try {
    const project = new Project({ title, description, imageUrl, clientName, date, details });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error creating project', error: err.message });
  }
});

app.put('/api/projects/:id', auth, async (req, res) => {
  const { title, description, imageUrl, clientName, date, details } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    if (title) project.title = title;
    if (description) project.description = description;
    if (imageUrl) project.imageUrl = imageUrl;
    if (clientName) project.clientName = clientName;
    if (date) project.date = date;
    if (details) project.details = details;

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error updating project', error: err.message });
  }
});

app.delete('/api/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
});

// ==========================================
// 5. ARTICLES / BLOGS ROUTES
// ==========================================

// Get all articles (Public)
app.get('/api/articles', async (req, res) => {
  const { search, category } = req.query;
  try {
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    const articles = await Article.find(query).sort({ date: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching articles', error: err.message });
  }
});

// Get article details (Public)
app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching article details', error: err.message });
  }
});

// Add article (Admin)
app.post('/api/articles', auth, async (req, res) => {
  const { title, description, content, imageUrl, author, category, featured } = req.body;
  if (!title || !description || !content || !imageUrl || !author || !category) {
    return res.status(400).json({ message: 'All fields except featured are required.' });
  }
  try {
    const article = new Article({ title, description, content, imageUrl, author, category, featured });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: 'Error creating article', error: err.message });
  }
});

// Edit article (Admin)
app.put('/api/articles/:id', auth, async (req, res) => {
  const { title, description, content, imageUrl, author, category, featured } = req.body;
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found.' });

    if (title) article.title = title;
    if (description) article.description = description;
    if (content) article.content = content;
    if (imageUrl) article.imageUrl = imageUrl;
    if (author) article.author = author;
    if (category) article.category = category;
    if (featured !== undefined) article.featured = featured;

    await article.save();
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Error updating article', error: err.message });
  }
});

// Delete article (Admin)
app.delete('/api/articles/:id', auth, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    res.json({ message: 'Article deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting article', error: err.message });
  }
});

// ==========================================
// 6. EVENTS ROUTES
// ==========================================

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
});

app.post('/api/events', auth, async (req, res) => {
  const { title, description, date, location, isPromotional } = req.body;
  if (!title || !description || !date || !location) {
    return res.status(400).json({ message: 'Title, description, date, and location are required.' });
  }
  try {
    const event = new Event({ title, description, date, location, isPromotional });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err.message });
  }
});

app.put('/api/events/:id', auth, async (req, res) => {
  const { title, description, date, location, isPromotional } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (location) event.location = location;
    if (isPromotional !== undefined) event.isPromotional = isPromotional;

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error updating event', error: err.message });
  }
});

app.delete('/api/events/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json({ message: 'Event deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event', error: err.message });
  }
});

// ==========================================
// 7. GALLERY ROUTES
// ==========================================

app.get('/api/gallery', async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching gallery items', error: err.message });
  }
});

app.post('/api/gallery', auth, async (req, res) => {
  const { imageUrl, caption, category } = req.body;
  if (!imageUrl || !caption || !category) {
    return res.status(400).json({ message: 'Image URL, caption, and category are required.' });
  }
  try {
    const galleryItem = new Gallery({ imageUrl, caption, category });
    await galleryItem.save();
    res.status(201).json(galleryItem);
  } catch (err) {
    res.status(500).json({ message: 'Error uploading gallery item', error: err.message });
  }
});

app.delete('/api/gallery/:id', auth, async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndDelete(req.params.id);
    if (!galleryItem) return res.status(404).json({ message: 'Gallery item not found.' });
    res.json({ message: 'Gallery item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting gallery item', error: err.message });
  }
});

// ==========================================
// 8. TESTIMONIALS ROUTES
// ==========================================

app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching testimonials', error: err.message });
  }
});

app.post('/api/testimonials', auth, async (req, res) => {
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
});

app.put('/api/testimonials/:id', auth, async (req, res) => {
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
});

app.delete('/api/testimonials/:id', auth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found.' });
    res.json({ message: 'Testimonial deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting testimonial', error: err.message });
  }
});

// ==========================================
// 9. DASHBOARD & ANALYTICS ROUTES (ADMIN ONLY)
// ==========================================

app.get('/api/dashboard/analytics', auth, async (req, res) => {
  try {
    // 1. Get Totals
    const totalInquiries = await Inquiry.countDocuments();
    const totalServices = await Solution.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalArticles = await Article.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalTestimonials = await Testimonial.countDocuments();

    // 2. Fetch Recent Inquiries (Limit to 5)
    const recentInquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(5);

    // 3. Inquiry Statistics (Grouped by Country for visualization)
    const countryDistribution = await Inquiry.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 4. Monthly Inquiry Data (Grouped by year-month)
    const monthlyInquiries = await Inquiry.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format monthly counts to readable months
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthly = monthlyInquiries.map(item => {
      const monthLabel = `${monthNames[item._id.month - 1]} ${item._id.year}`;
      return { month: monthLabel, count: item.count };
    });

    // Fallback if no database queries exist for charts
    if (formattedMonthly.length === 0) {
      formattedMonthly.push({ month: "Jun 2026", count: 0 });
    }

    res.json({
      metrics: {
        totalInquiries,
        totalServices,
        totalProjects,
        totalArticles,
        totalEvents,
        totalTestimonials
      },
      recentInquiries,
      charts: {
        countryStats: countryDistribution.map(item => ({ name: item._id, value: item.count })),
        monthlyInquiries: formattedMonthly
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving dashboard analytics', error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Express API Server listening on port ${PORT}`);
});
