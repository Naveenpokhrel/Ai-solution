import Solution from '../models/Solution.js';

export const getSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find().sort({ createdAt: -1 });
    res.json(solutions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching solutions', error: err.message });
  }
};

export const addSolution = async (req, res) => {
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
};

export const editSolution = async (req, res) => {
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
};

export const deleteSolution = async (req, res) => {
  try {
    const solution = await Solution.findByIdAndDelete(req.params.id);
    if (!solution) return res.status(404).json({ message: 'Solution not found.' });
    res.json({ message: 'Solution deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting solution', error: err.message });
  }
};
