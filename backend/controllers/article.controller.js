import Article from '../models/Article.js';

export const getArticles = async (req, res) => {
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
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching article details', error: err.message });
  }
};

export const addArticle = async (req, res) => {
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
};

export const editArticle = async (req, res) => {
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
};

export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    res.json({ message: 'Article deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting article', error: err.message });
  }
};
