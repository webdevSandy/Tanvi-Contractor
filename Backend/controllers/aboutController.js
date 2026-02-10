const About = require('../models/About');

// @desc    Get about section data
// @route   GET /api/about
// @access  Public
exports.getAbout = async (req, res) => {
    try {
        const about = await About.getSingleton();
        res.json(about);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update about section data
// @route   PUT /api/about
// @access  Private/Admin
exports.updateAbout = async (req, res) => {
    const { title, description, phone, email, address } = req.body;

    try {
        const about = await About.getSingleton();

        about.title = title || about.title;
        about.description = description || about.description;
        about.phone = phone || about.phone;
        about.email = email || about.email;
        about.address = address || about.address;

        if (req.file) {
            about.image = req.file.path;
        }

        const updatedAbout = await about.save();
        res.json(updatedAbout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
