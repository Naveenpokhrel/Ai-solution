import Inquiry from '../models/Inquiry.js';
import Solution from '../models/Solution.js';
import Project from '../models/Project.js';
import Article from '../models/Article.js';
import Event from '../models/Event.js';
import Testimonial from '../models/Testimonial.js';

export const getAnalytics = async (req, res) => {
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
};
