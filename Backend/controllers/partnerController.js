const Partner = require('../models/Partner.js');
const { logActivity } = require('./activityLogController');

// Controller methods for Partners - Refreshed

exports.createPartner = async (req, res) => {
    try {
        let partnerData = req.body;
        if (req.file) {
            partnerData.logo = req.file.path;
        }
        const partner = await Partner.create(partnerData);
        
        await logActivity(req.user._id, req.user.username, 'CREATE_PARTNER', { 
            partnerId: partner._id,
            partnerName: partner.name 
        }, req);

        res.status(201).json(partner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPartners = async (req, res) => {
    try {
        const partners = await Partner.find().sort({ createdAt: -1 });
        res.json(partners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePartner = async (req, res) => {
    try {
        let updateData = req.body;
        if (req.file) {
            updateData.logo = req.file.path;
        }
        const partner = await Partner.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!partner) return res.status(404).json({ message: 'Partner not found' });
        
        await logActivity(req.user._id, req.user.username, 'UPDATE_PARTNER', { 
            partnerId: partner.id,
            partnerName: partner.name,
            snapshot: partner.toObject()
        }, req);

        res.json(partner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findByIdAndDelete(req.params.id);
        if (!partner) return res.status(404).json({ message: 'Partner not found' });
        
        await logActivity(req.user._id, req.user.username, 'DELETE_PARTNER', { 
            partnerId: req.params.id,
            partnerName: partner.name,
            snapshot: partner.toObject()
        }, req);

        res.json({ message: 'Partner removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
