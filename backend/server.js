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
import EnquiryReport from './models/EnquiryReport.js';
import ChatbotLog from './models/ChatbotLog.js';
import AdminLoginLog from './models/AdminLoginLog.js';

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
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    if (err.name === 'MongooseServerSelectionError') {
      console.error('\n========================================================================');
      console.error('CRITICAL ERROR: Could not connect to any servers in your MongoDB Atlas cluster.');
      console.error('One common reason is that your current IP address is not whitelisted.');
      console.error('Please whitelist your current public IP address in your MongoDB Atlas dashboard:');
      console.error('https://cloud.mongodb.com/ -> Network Access -> Add IP Address');
      console.error('========================================================================\n');
    }
  });

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

    // Log successful admin login
    try {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const loginLog = new AdminLoginLog({
        admin_id: admin._id,
        captcha_status: req.body.captchaStatus || "Passed", // default to "Passed" if captcha is not explicitly checked
        ip_address: clientIp
      });
      await loginLog.save();
    } catch (logErr) {
      console.error('Failed to write admin login log:', logErr);
    }

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

    // Automatically create an EnquiryReport for this inquiry
    try {
      const report = new EnquiryReport({
        enquiry_id: newInquiry._id,
        notes: `Automated report generated on inquiry submission from ${name} (${email}).`
      });
      await report.save();
    } catch (reportErr) {
      console.error('Failed to auto-create EnquiryReport:', reportErr);
    }

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
    const projects = await Project.find().populate('service_id').sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
});

app.post('/api/projects', auth, async (req, res) => {
  const { title, service_id, industry, description, imageUrl, clientName, date, completion_date, details } = req.body;
  if (!title || !description || !imageUrl) {
    return res.status(400).json({ message: 'Title, description, and image URL are required.' });
  }
  try {
    const project = new Project({
      title,
      service_id: service_id || null,
      industry: industry || 'General',
      description,
      imageUrl,
      clientName,
      date,
      completion_date: completion_date || null,
      details
    });
    await project.save();
    const populated = await Project.findById(project._id).populate('service_id');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Error creating project', error: err.message });
  }
});

app.put('/api/projects/:id', auth, async (req, res) => {
  const { title, service_id, industry, description, imageUrl, clientName, date, completion_date, details } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    if (title !== undefined) project.title = title;
    if (service_id !== undefined) project.service_id = service_id || null;
    if (industry !== undefined) project.industry = industry || 'General';
    if (description !== undefined) project.description = description;
    if (imageUrl !== undefined) project.imageUrl = imageUrl;
    if (clientName !== undefined) project.clientName = clientName;
    if (date !== undefined) project.date = date;
    if (completion_date !== undefined) project.completion_date = completion_date || null;
    if (details !== undefined) project.details = details;

    await project.save();
    const populated = await Project.findById(project._id).populate('service_id');
    res.json(populated);
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
    const galleryItems = await Gallery.find().populate('eventId').sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching gallery items', error: err.message });
  }
});

app.post('/api/gallery', auth, async (req, res) => {
  const { imageUrl, caption, category, eventId } = req.body;
  if (!imageUrl || !caption || !category) {
    return res.status(400).json({ message: 'Image URL, caption, and category are required.' });
  }
  try {
    const galleryItem = new Gallery({ imageUrl, caption, category, eventId: eventId || null });
    await galleryItem.save();
    const populated = await Gallery.findById(galleryItem._id).populate('eventId');
    res.status(201).json(populated);
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

app.post('/api/testimonials', async (req, res) => {
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

// ==========================================
// 8. AI CHATBOT ROUTE
// ==========================================
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'Messages array is required.' });
  }

  try {
    // Fetch dynamic context from Database
    const solutions = await Solution.find({}, 'title description');
    const projects = await Project.find({}, 'title description clientName');

    const solutionsContext = solutions.map(s => `- ${s.title}: ${s.description}`).join('\n');
    const projectsContext = projects.map(p => `- ${p.title} for ${p.clientName}: ${p.description}`).join('\n');

    const systemPrompt = `You are the professional AI Assistant for 'AI-Solutions', a premium software consulting company.
Use the following database context to answer user queries:

Services/Solutions We Offer:
${solutionsContext || 'Predictive Analytics, Custom Software, Cybersecurity audits.'}

Recent Projects/Case Studies:
${projectsContext || 'Smart Logistics Engine, Decentralized Payment API.'}

Contact Office Info:
- Address: 100 Technology Way, Silicon Valley, CA
- Email: support@ai-solutions.com
- Phone: +1 (555) 019-2831
- Business Hours: Mon - Fri: 9:00 AM - 6:00 PM PST

Guidelines:
1. Provide accurate, professional, and friendly answers.
2. Keep your answers concise (strictly under 3 sentences).
3. If they ask about services or projects, recommend relevant ones and suggest visiting the "Services" or "Projects" pages.
4. If they want to speak to an engineer, get a quote, or schedule a consultation, recommend filling out the inquiry form on the "Contact Us" page.
5. If they ask generic questions, align your answers with AI-Solutions' expertise.`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Intelligent fallback when GEMINI_API_KEY is not defined
      const lastUserMsg = messages[messages.length - 1]?.text || '';
      const textLower = lastUserMsg.toLowerCase();
      let reply = '';

      if (textLower.includes('faq') || textLower.includes('hours') || textLower.includes('location') || textLower.includes('where')) {
        reply = 'AI-Solutions is open Monday - Friday, 9:00 AM - 6:00 PM PST. Our engineering headquarters is located at 100 Technology Way, Silicon Valley, CA.';
      } else if (textLower.includes('service') || textLower.includes('solution') || textLower.includes('software') || textLower.includes('build') || textLower.includes('offer')) {
        const solTitles = solutions.map(s => s.title).join(', ');
        reply = `We build tailored software architectures. Our services include: ${solTitles || 'Predictive Analytics, Custom Software, and Cybersecurity'}. Please check out our Services page for details!`;
      } else if (textLower.includes('contact') || textLower.includes('talk') || textLower.includes('phone') || textLower.includes('email') || textLower.includes('inquir')) {
        reply = 'To speak with a lead engineer or get a consultation quote, please visit our Contact Us page and fill out the inquiry form.';
      } else if (textLower.includes('project') || textLower.includes('case') || textLower.includes('work') || textLower.includes('done')) {
        const projTitles = projects.map(p => p.title).join(', ');
        reply = `We have completed projects such as: ${projTitles || 'Smart Logistics Engine, Decentralized Payment API'}. Check out our Projects page for the full list!`;
      } else {
        reply = "Hello! I am the AI-Solutions Assistant. (To enable full AI power, add GEMINI_API_KEY to the backend .env file). How can I help you explore our services, projects, or schedule a consultation today?";
      }

      // Log chatbot interaction
      try {
        const chatLog = new ChatbotLog({
          user_question: lastUserMsg || "Hello",
          bot_response: reply
        });
        await chatLog.save();
      } catch (logErr) {
        console.error('Failed to save chatbot log:', logErr);
      }

      return res.json({ reply });
    }

    // Convert messages to Gemini API format (only 'user' or 'model' roles allowed)
    // Map isBot -> role: 'model' (or 'user')
    const contents = messages
      .filter(msg => !msg.isOptions && msg.text) // filter options prompts
      .map(msg => ({
        role: msg.isBot ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

    // If contents array is empty, default it
    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'Hello' }] });
    }

    // Call Gemini API using fetch
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble processing that right now. Please try again.";
    const replyText = reply.trim();

    // Log chatbot interaction
    try {
      const lastUserMsg = messages[messages.length - 1]?.text || 'Hello';
      const chatLog = new ChatbotLog({
        user_question: lastUserMsg,
        bot_response: replyText
      });
      await chatLog.save();
    } catch (logErr) {
      console.error('Failed to save chatbot log:', logErr);
    }

    res.json({ reply: replyText });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ message: 'Error communicating with AI Chatbot', error: err.message });
  }
});

// ==========================================
// 10. ADMIN LOGS & REPORTS ROUTES (ADMIN ONLY)
// ==========================================

// Get admin login logs (Admin only)
app.get('/api/logs/login', auth, async (req, res) => {
  try {
    const logs = await AdminLoginLog.find()
      .populate('admin_id', 'username email')
      .sort({ login_time: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching login logs', error: err.message });
  }
});

// Get chatbot interaction logs (Admin only)
app.get('/api/logs/chatbot', auth, async (req, res) => {
  try {
    const logs = await ChatbotLog.find().sort({ created_at: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chatbot logs', error: err.message });
  }
});

// Get all enquiry reports (Admin only)
app.get('/api/reports/enquiries', auth, async (req, res) => {
  try {
    const reports = await EnquiryReport.find()
      .populate('enquiry_id')
      .sort({ report_date: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enquiry reports', error: err.message });
  }
});

// Create a new enquiry report (Admin only)
app.post('/api/reports/enquiries', auth, async (req, res) => {
  const { enquiry_id, notes, inquiry_count } = req.body;
  if (!enquiry_id) {
    return res.status(400).json({ message: 'Enquiry ID is required.' });
  }
  try {
    const report = new EnquiryReport({
      enquiry_id,
      notes,
      inquiry_count: inquiry_count || 1
    });
    await report.save();
    const populated = await EnquiryReport.findById(report._id).populate('enquiry_id');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Error creating enquiry report', error: err.message });
  }
});

// Delete an enquiry report (Admin only)
app.delete('/api/reports/enquiries/:id', auth, async (req, res) => {
  try {
    const report = await EnquiryReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: 'Enquiry report not found.' });
    res.json({ message: 'Enquiry report deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting enquiry report', error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Express API Server listening on port ${PORT}`);
});

