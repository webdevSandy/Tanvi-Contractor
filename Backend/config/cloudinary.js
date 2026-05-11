const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Check if it's a lottie/json file
    if (file.originalname.match(/\.(json|lottie)$/i) || file.mimetype === 'application/json') {
      return {
        folder: 'tanvi_contractor',
        resource_type: 'raw'
      };
    }
    // Default for images
    return {
      folder: 'tanvi_contractor',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'svg'],
      resource_type: 'image'
    };
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
