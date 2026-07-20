import AdminLoginLog from '../models/AdminLoginLog.js';
import ChatbotLog from '../models/ChatbotLog.js';
import EnquiryReport from '../models/EnquiryReport.js';

// Get admin login logs (Admin only)
export const getLoginLogs = async (req, res) => {
  try {
    const logs = await AdminLoginLog.find()
      .populate('admin_id', 'username email')
      .sort({ login_time: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching login logs', error: err.message });
  }
};

// Get chatbot interaction logs (Admin only)
export const getChatbotLogs = async (req, res) => {
  try {
    const logs = await ChatbotLog.find().sort({ created_at: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chatbot logs', error: err.message });
  }
};

// Get all enquiry reports (Admin only)
export const getEnquiryReports = async (req, res) => {
  try {
    const reports = await EnquiryReport.find()
      .populate('enquiry_id')
      .sort({ report_date: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enquiry reports', error: err.message });
  }
};

// Create a new enquiry report (Admin only)
export const createEnquiryReport = async (req, res) => {
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
};

// Delete an enquiry report (Admin only)
export const deleteEnquiryReport = async (req, res) => {
  try {
    const report = await EnquiryReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: 'Enquiry report not found.' });
    res.json({ message: 'Enquiry report deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting enquiry report', error: err.message });
  }
};
