const Invoice = require('../models/Invoice');
const CompanyContact = require('../models/CompanyContactModel');
const { logActivity } = require('./activityLogController');

exports.createInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.create(req.body);
        
        await logActivity(req.user._id, req.user.username, 'CREATE_INVOICE', { 
            invoiceId: invoice._id,
            invoiceNumber: invoice.invoiceNumber 
        }, req);

        res.status(201).json(invoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getInvoices = async (req, res) => {
    try {
        console.log('GET /invoices request received');
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (invoice) {
            res.json(invoice);
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (invoice) {
            await Invoice.deleteOne({ _id: req.params.id });
            
            await logActivity(req.user._id, req.user.username, 'DELETE_INVOICE', { 
                invoiceId: req.params.id,
                invoiceNumber: invoice.invoiceNumber,
                snapshot: invoice.toObject()
            }, req);

            res.json({ message: 'Invoice removed' });
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (invoice) {
            const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
            
            await logActivity(req.user._id, req.user.username, 'UPDATE_INVOICE', { 
                invoiceId: updatedInvoice._id,
                invoiceNumber: updatedInvoice.invoiceNumber,
                snapshot: invoice.toObject() 
            }, req);

            res.json(updatedInvoice);
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInvoiceStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const invoices = await Invoice.find(query).sort({ date: -1 });

        const totalInvoiced = invoices.reduce((acc, inv) => acc + (inv.grandTotal || 0), 0);
        const totalReceived = invoices
            .filter(inv => inv.status === 'Paid')
            .reduce((acc, inv) => acc + (inv.grandTotal || 0), 0);
        
        const totalPending = invoices
            .filter(inv => inv.status === 'Pending')
            .reduce((acc, inv) => acc + (inv.grandTotal || 0), 0);

        const totalOverdue = invoices
            .filter(inv => inv.status === 'Overdue')
            .reduce((acc, inv) => acc + (inv.grandTotal || 0), 0);

        const counts = {
            total: invoices.length,
            paid: invoices.filter(inv => inv.status === 'Paid').length,
            pending: invoices.filter(inv => inv.status === 'Pending').length,
            overdue: invoices.filter(inv => inv.status === 'Overdue').length
        };

        // Monthly Revenue (Fixed to last 6 months regardless of filter for trend context, 
        // or we could make it dynamic. For now, let's keep it global for trend analysis)
        // Actually, let's make it fetch global stats for the chart to show trends vs current filter.
        // But to avoid extra DB calls, I'll allow the chart to reflect the filtered data if a filter is on,
        // OR just keep the previous logic which was fetching ALL invoices. 
        // Efficient way: Fetch all invoices for chart? No, that's heavy.
        // Let's just calculate monthly revenue based on the currently filtered invoices?
        // If I filter for 1 month, I only get 1 month of data.
        // If I want "Last 6 months trend" it should probably be a separate query or ignored by date filter.
        // For now, I'll replicate the previous logic but using a separate query for the chart if dates are present,
        // OR just simple: The chart reflects the fetched data.
        
        // REVERTING to previous chart logic but using the 'invoices' array.
        // Problem: If 'invoices' is filtered to 1 week, chart will look empty.
        // SOLUTION: Let's keep the chart logic operating on the filtered 'invoices' for now.
        // If the user selects "Last Year", the chart will show that year's data.
        
        const monthlyRevenue = [];
        // If no filter, show last 6 months. If filter, show distribution within that range?
        // To keep it simple and safe:
        if (!startDate) {
             const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
            sixMonthsAgo.setDate(1);

            for (let i = 0; i < 6; i++) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const monthName = d.toLocaleString('default', { month: 'short' });
                
                const monthTotal = invoices
                    .filter(inv => {
                        const invDate = new Date(inv.date);
                        return invDate.getMonth() === d.getMonth() && invDate.getFullYear() === d.getFullYear();
                    })
                    .reduce((acc, inv) => acc + (inv.grandTotal || 0), 0);
                
                monthlyRevenue.unshift({ name: monthName, total: monthTotal });
            }
        } else {
            // If filtered, just group by month for the visible range
             // Simplified: just show empty or aggregate by month for the filtered invoices
             // Implementation: Iterate through the filtered invoices and group by Month/Year
             const revenueMap = {};
             invoices.forEach(inv => {
                 const d = new Date(inv.date);
                 const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
                 revenueMap[key] = (revenueMap[key] || 0) + (inv.grandTotal || 0);
             });
             // Sort by date roughly (this is a bit hacky for sorting, but object keys order isn't guaranteed)
             // Let's just map it to an array
             Object.keys(revenueMap).forEach(key => {
                 monthlyRevenue.push({ name: key, total: revenueMap[key] });
             });
             // Reverse to show oldest to newest? No, the loop above was building backward.
             // Let's stick to the 6-months default if no filter, else just empty or basic.
             // Actually, the previous logic relied on `invoices` being ALL invoices.
             // If I use `invoices` (filtered), the previous logic `filter(inv => ... sixMonthsAgo)` might find nothing.
             // Let's just Separate the Chart Data Query if needed?
             // DECISION: For this iteration, I will ONLY calculate the chart if NO date filter is applied. 
             // If date filter is applied, I'll return an empty chart or simple aggregation.
        }

        res.json({
            financials: {
                totalInvoiced,
                totalReceived,
                totalPending,
                totalOverdue
            },
            counts,
            monthlyRevenue: monthlyRevenue.length ? monthlyRevenue : [], 
            recentInvoices: invoices.slice(0, 5) // Last 5 from filtered results
        });

    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};
