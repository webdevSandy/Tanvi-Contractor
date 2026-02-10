const ActivityLog = require('../models/ActivityLog');

// Helper function to log activity
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

module.exports = {
    logActivity,
    getLogs
};
