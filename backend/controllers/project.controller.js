import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('service_id').sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
};

export const addProject = async (req, res) => {
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
};

export const editProject = async (req, res) => {
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
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
};
