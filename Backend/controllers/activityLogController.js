const ActivityLog = require('../models/ActivityLog');

// Helper function to log activity - Refreshed
const logActivity = async (userId, username, action, details = {}, req = null) => {
    try {
        let ipAddress = '';
        if (req) {
            ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        }

        await ActivityLog.create({
            user: userId,
            username: username,
            action,
            details,
            ipAddress
        });
        // console.log(`Activity Logged: ${action} by ${username}`);
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};

// API to get logs
const getLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const logs = await ActivityLog.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'username email profileImage');

        const total = await ActivityLog.countDocuments();

        res.json({
            logs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalLogs: total
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};



const Invoice = require('../models/Invoice');
const Partner = require('../models/Partner.js');

// Undo Activity
const undoActivity = async (req, res) => {
    try {
        const logId = req.params.id;
        const log = await ActivityLog.findById(logId);

        if (!log) {
            return res.status(404).json({ message: 'Activity log not found' });
        }

        const { action, details } = log;
        let result;

        switch (action) {
            // --- INVOICE ACTIONS ---
            case 'CREATE_INVOICE':
                // Undo Create -> Delete
                result = await Invoice.findByIdAndDelete(details.invoiceId);
                break;
            
            case 'DELETE_INVOICE':
                // Undo Delete -> Restore (Create from snapshot)
                if (details.snapshot) {
                    delete details.snapshot._id; // Let Mongo generate new ID or use old one if needed, but usually new is safer to avoid conflicts if re-created
                    // Actually, for restore, we might want to keep the same ID if possible, but let's keep it simple and create new or upsert
                    // To keep references, we should try to restore with same ID if it doesn't exist
                    result = await Invoice.create(details.snapshot); 
                }
                break;

            case 'UPDATE_INVOICE':
                // Undo Update -> Revert to snapshot
                if (details.snapshot) {
                   result = await Invoice.findByIdAndUpdate(details.invoiceId, details.snapshot, { new: true });
                }
                break;

            // --- PARTNER ACTIONS ---
            case 'CREATE_PARTNER':
                result = await Partner.findByIdAndDelete(details.partnerId);
                break;

            case 'DELETE_PARTNER':
                if (details.snapshot) {
                    delete details.snapshot._id;
                    result = await Partner.create(details.snapshot);
                }
                break;

            case 'UPDATE_PARTNER':
                if (details.snapshot) {
                    result = await Partner.findByIdAndUpdate(details.partnerId, details.snapshot, { new: true });
                }
                break;

            default:
                return res.status(400).json({ message: 'Undo not supported for this action' });
        }

        // Log the Undo Action itself
        await logActivity(req.user._id, req.user.username, `UNDO_${action}`, { originalLogId: logId }, req);

        res.json({ message: 'Action undone successfully', result });

    } catch (error) {
        console.error('Undo Failed:', error);
        res.status(500).json({ message: 'Failed to undo action: ' + error.message });
    }
};

module.exports = {
    logActivity,
    getLogs,
    undoActivity
};
