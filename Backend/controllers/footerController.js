const Footer = require('../models/FooterModel');

// @desc    Get footer social links
// @route   GET /api/footer
// @access  Public
exports.getFooter = async (req, res) => {
    try {
        const footer = await Footer.getSingleton();
        res.json(footer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update footer social links
// @route   PUT /api/footer
// @access  Private/Admin
exports.updateFooter = async (req, res) => {
    const { facebook, instagram, twitter, linkedin, privacyPolicy, termsConditions, refundPolicy } = req.body;

    try {
        const footer = await Footer.getSingleton();

        footer.facebook = facebook || '';
        footer.instagram = instagram || '';
        footer.twitter = twitter || '';
        footer.linkedin = linkedin || '';
        footer.privacyPolicy = privacyPolicy || '';
        footer.termsConditions = termsConditions || '';
        footer.refundPolicy = refundPolicy || '';

        const updatedFooter = await footer.save();
        res.json(updatedFooter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
