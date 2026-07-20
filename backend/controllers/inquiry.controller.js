import Inquiry from '../models/Inquiry.js';
import EnquiryReport from '../models/EnquiryReport.js';

export const submitInquiry = async (req, res) => {
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
};

export const getInquiries = async (req, res) => {
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
};

export const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inquiry details', error: err.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    res.json({ message: 'Inquiry deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting inquiry', error: err.message });
  }
};
