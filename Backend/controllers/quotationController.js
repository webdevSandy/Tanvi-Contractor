const Quotation = require('../models/Quotation');

// Format quotation number: ENV/QTN/YY-YY/00X
const generateQuotationNumber = async () => {
    // Current financial year logic (assuming April to March)
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    let yearPrefix = '';
    if (currentMonth >= 3) { // April or later
        yearPrefix = `${currentYear.toString().slice(-2)}-${(currentYear + 1).toString().slice(-2)}`;
    } else {
        yearPrefix = `${(currentYear - 1).toString().slice(-2)}-${currentYear.toString().slice(-2)}`;
    }

    const lastQuotation = await Quotation.findOne().sort({ createdAt: -1 });
    let sequenceNumber = 1;

    if (lastQuotation && lastQuotation.quotationNumber.includes(yearPrefix)) {
        const parts = lastQuotation.quotationNumber.split('/');
        const lastSequence = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(lastSequence)) {
            sequenceNumber = lastSequence + 1;
        }
    }

    const sequenceString = sequenceNumber.toString().padStart(3, '0');
    return `TCE/QTN/${yearPrefix}/${sequenceString}`;
};

// Create a new quotation
exports.createQuotation = async (req, res) => {
    try {
        const quotationData = req.body;
        if (!quotationData.quotationNumber) {
            quotationData.quotationNumber = await generateQuotationNumber();
        }

        const newQuotation = new Quotation(quotationData);
        await newQuotation.save();
        res.status(201).json(newQuotation);
    } catch (error) {
        console.error("Error creating quotation:", error);
        res.status(500).json({ message: 'Error creating quotation', error: error.message });
    }
};

// Get all quotations
exports.getQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find().sort({ createdAt: -1 });
        res.status(200).json(quotations);
    } catch (error) {
        console.error("Error fetching quotations:", error);
        res.status(500).json({ message: 'Error fetching quotations', error: error.message });
    }
};

// Get a single quotation by ID
exports.getQuotationById = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }
        res.status(200).json(quotation);
    } catch (error) {
        console.error("Error fetching quotation:", error);
        res.status(500).json({ message: 'Error fetching quotation', error: error.message });
    }
};

// Update a quotation
exports.updateQuotation = async (req, res) => {
    try {
        let updateData = { ...req.body };
        const updatedQuotation = await Quotation.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedQuotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        res.status(200).json(updatedQuotation);
    } catch (error) {
        console.error("Error updating quotation:", error);
        res.status(500).json({ message: 'Error updating quotation', error: error.message });
    }
};

// Delete a quotation
exports.deleteQuotation = async (req, res) => {
    try {
        const deletedQuotation = await Quotation.findByIdAndDelete(req.params.id);
        if (!deletedQuotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }
        res.status(200).json({ message: 'Quotation deleted successfully' });
    } catch (error) {
        console.error("Error deleting quotation:", error);
        res.status(500).json({ message: 'Error deleting quotation', error: error.message });
    }
};
