import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import all models to run their pre-save hooks
import Admin from './models/Admin.js';
import Inquiry from './models/Inquiry.js';
import EnquiryReport from './models/EnquiryReport.js';
import Solution from './models/Solution.js';
import Project from './models/Project.js';
import Event from './models/Event.js';
import Gallery from './models/Gallery.js';
import Article from './models/Article.js';
import ChatbotLog from './models/ChatbotLog.js';
import Testimonial from './models/Testimonial.js';

dotenv.config();

const runMigration = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log("Connecting to database...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    // 1. Migrate Projects
    console.log("Migrating Projects...");
    const projects = await Project.find();
    for (const project of projects) {
      // Force trigger pre-save hook
      project.markModified('title');
      await project.save();
    }
    console.log(`Migrated ${projects.length} Projects.`);

    // 2. Migrate Events
    console.log("Migrating Events...");
    const events = await Event.find();
    for (const event of events) {
      event.markModified('title');
      await event.save();
    }
    console.log(`Migrated ${events.length} Events.`);

    // 3. Migrate Galleries
    console.log("Migrating Galleries...");
    const galleries = await Gallery.find();
    for (const gallery of galleries) {
      gallery.markModified('imageUrl');
      await gallery.save();
    }
    console.log(`Migrated ${galleries.length} Galleries.`);

    // 4. Migrate Solutions
    console.log("Migrating Solutions...");
    const solutions = await Solution.find();
    for (const solution of solutions) {
      solution.markModified('title');
      await solution.save();
    }
    console.log(`Migrated ${solutions.length} Solutions.`);

    // 5. Migrate Inquiries
    console.log("Migrating Inquiries...");
    const inquiries = await Inquiry.find();
    for (const inquiry of inquiries) {
      inquiry.markModified('companyName');
      await inquiry.save();
    }
    console.log(`Migrated ${inquiries.length} Inquiries.`);

    // 6. Migrate Testimonials
    console.log("Migrating Testimonials...");
    const testimonials = await Testimonial.find();
    for (const testimonial of testimonials) {
      testimonial.markModified('customerName');
      await testimonial.save();
    }
    console.log(`Migrated ${testimonials.length} Testimonials.`);

    console.log("All existing entries successfully migrated and synced!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

runMigration();
