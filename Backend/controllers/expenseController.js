const Expense = require('../models/Expense');
const { logActivity } = require('./activityLogController');

exports.addExpense = async (req, res) => {
    try {
        const expense = await Expense.create({
            ...req.body,
            user: req.user._id
        });

        await logActivity(req.user._id, req.user.username, 'CREATE_EXPENSE', {
            expenseId: expense._id,
            title: expense.title,
            amount: expense.amount
        }, req);

        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const { startDate, endDate, category } = req.query;
        let query = {};

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        if (category && category !== 'All') {
            query.category = category;
        }

        const expenses = await Expense.find(query).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        await Expense.deleteOne({ _id: req.params.id });

        await logActivity(req.user._id, req.user.username, 'DELETE_EXPENSE', {
            expenseId: req.params.id,
            title: expense.title,
            amount: expense.amount
        }, req);

        res.json({ message: 'Expense removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
