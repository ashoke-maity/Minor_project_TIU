const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert image buffer to base64 string
    const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'uploads', // optional: add folder in cloudinary
    });

    // Optimized and cropped URLs
    const optimizeUrl = cloudinary.url(result.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
    });

    const autoCropUrl = cloudinary.url(result.public_id, {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });

    res.status(200).json({
      message: 'Image uploaded successfully',
      data: {
        secureUrl: result.secure_url,
        optimizeUrl,
        autoCropUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

module.exports = {
  uploadImage,
};
