import Gallery from '../models/Gallery.js';

export const getGallery = async (req, res) => {
  try {
    const galleryItems = await Gallery.find().populate('eventId').sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching gallery items', error: err.message });
  }
};

export const addGalleryItem = async (req, res) => {
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
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndDelete(req.params.id);
    if (!galleryItem) return res.status(404).json({ message: 'Gallery item not found.' });
    res.json({ message: 'Gallery item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting gallery item', error: err.message });
  }
};
