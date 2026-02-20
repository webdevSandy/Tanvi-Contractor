const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const contactRoutes = require('./routes/contactRoutes'); // Added
const aboutRoutes = require('./routes/aboutRoutes'); // Added for about routes

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/contacts', contactRoutes); 
app.use('/api/about', aboutRoutes); 
app.use('/api/company-contact', require('./routes/companyContactRoutes'));
app.use('/api/footer', require('./routes/footerRoutes')); // Added
app.use('/api/activity-logs', require('./routes/activityLogRoutes')); // Activity Logs
app.use('/api/expenses', require('./routes/expenseRoutes')); // Expenses

app.get('/', (req, res) => {
    res.send('Tanvi Contractor Backend is running');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.log(err));
