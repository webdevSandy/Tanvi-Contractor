const Invoice = require('../models/Invoice');
const CompanyContact = require('../models/CompanyContactModel');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
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

exports.generatePDF = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        const contact = await CompanyContact.getSingleton();

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Roboto:wght@400;700&display=swap');

                    body { 
                        font-family: 'Roboto', sans-serif; 
                        padding: 0; 
                        margin: 0; 
                        font-size: 12px;
                        -webkit-print-color-adjust: exact; 
                        print-color-adjust: exact;
                    }
                    .container { padding: 20px; }
                    
                    /* Header Styles */
                    .header-container { width: 100%; margin-bottom: 20px; }
                    
                    .top-row { display: flex; justify-content: space-between; color:#8B0000; align-items: flex-start; margin-bottom: 10px; font-weight: bold; font-size: 11px; }
                    .gst-pan { text-align: left; line-height: 1.4; }
                    .contact-info { text-align: right; line-height: 1.4; }
                    
                    .tax-invoice-badge { 
                        background-color: #8B0000 !important; 
                        color: white !important; 
                        padding: 4px 20px; 
                        font-weight: bold; 
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        border-radius: 4px;
                        white-space: nowrap;
                        display: inline-block;
                        -webkit-print-color-adjust: exact;
                    }

                    /* Brand Row */
                    .brand-row { 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        margin: 15px 0 20px 0; 
                        position: relative;
                    }
                    
                    /* CSS Logo "TN" */
                    .logo-circle {
                        width: 60px;
                        height: 60px;
                        border: 3px solid #8B0000;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 15px;
                        box-shadow: 0 0 0 2px white, 0 0 0 4px #8B0000;
                    }
                    .logo-text-inner {
                        font-family: 'Cinzel', serif;
                        font-size: 28px;
                        font-weight: bold;
                        color: #000;
                        position: relative;
                        line-height: 1;
                    }
                    .logo-text-inner::after {
                        content: '';
                        position: absolute;
                        width: 100%;
                        height: 2px;
                        background: #8B0000;
                        top: 50%;
                        left: 0;
                        z-index: -1;
                    }
                    .logo-t { position: relative; left: 2px; }
                    .logo-n { position: relative; left: -2px; color: #8B0000; }

                    /* Main Brand Text */
                    .brand-text {
                        font-family: 'Arial Black', 'Arial', sans-serif;
                        font-size: 42px;
                        color: #8B0000; /* Red Text */
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        /* White outline and soft shadow */
                        text-shadow: 
                            -1px -1px 0 #ffffff,  
                            1px -1px 0 #ffffff,
                            -1px 1px 0 #ffffff,
                            1px 1px 0 #ffffff, /* White Outline */
                            4px 4px 4px rgba(0, 0, 0, 0.3); /* Soft Black Shadow */
                        font-weight: 900;
                        font-style: italic;
                    }
                    /* Inner fill simulation */
                    .brand-text-inner {
                         -webkit-text-stroke: 1px #ffffff; /* White stroke */
                         color: #8B0000;
                    }

                    /* Address Bar */
                    .address-bar {
                        background-color: #8B0000 !important;
                        color: white !important;
                        text-align: center;
                        padding: 8px 0;
                        font-weight: bold;
                        font-size: 13px;
                        width: 100%;
                        border-top: 1px solid #555;
                        border-bottom: 2px solid #555;
                        margin-bottom: 20px;
                        text-transform: uppercase;
                        -webkit-print-color-adjust: exact;
                    }

                    /* Invoice Info Row */
                    .invoice-info-row {
                        display: flex;
                        justify-content: space-between;
                        font-weight: bold;
                        font-size: 14px;
                        padding: 0 5px;
                        margin-bottom: 10px;
                    }

                    /* Tables */
                    table { width: 100%; border-collapse: collapse; border: 1px solid black; font-size: 12px; }
                    td, th { border: 1px solid black; padding: 6px; vertical-align: top; }
                    
                    .items-table th { text-align: center; font-weight: bold; background-color: #f0f0f0; }
                    .items-table td { text-align: center; }
                    .items-table td.desc { text-align: left; }
                    
                    .amount-col { text-align: right; }
                    .total-row td { font-weight: bold; }
                    
                    strong { color: #000; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header-container">
                        <!-- 1. Top Center: Tax Invoice Badge -->
                        <div style="text-align: center; margin-bottom: 15px;">
                            <div class="tax-invoice-badge">Tax Invoice</div>
                        </div>

                        <!-- 2. Second Row: GST/PAN (Left) and Contact (Right) -->
                        <div class="top-row">
                            <div class="gst-pan">
                                GSTIN : ${contact.gstin || '09ELJPK1174H2ZV'}<br>
                                PAN No. : ${contact.pan || 'ELJPK1174H'}
                            </div>
                            <div class="contact-info">
                                Mob. : ${invoice.mobile || '8115747357'}<br>
                                Email Id:${invoice.email || 'tanvicontractor2022@gmail.com'}
                            </div>
                        </div>

                        <!-- Brand Row: Logo | Text -->
                        <div class="brand-row">
                            <!-- CSS Circular Logo -->
                            <div class="logo-circle">
                                <div class="logo-text-inner">
                                    <span class="logo-t">T</span><span class="logo-n">N</span>
                                </div>
                            </div>
                            
                            <!-- Stylized Text -->
                            <div class="brand-text brand-text-inner">
                                TANVI CONTRACTOR
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Full Width Address Bar -->
                <div class="address-bar">
                    Khasra No. 219, Eklashpura Chakbandi Kshetra, ORAI-285001 (Jalaun) U.P.
                </div>

                <div class="container" style="padding-top: 10px; padding-bottom: 0;">
                    <div class="invoice-info-row">
                        <span>INVOICE No:- ${invoice.invoiceNumber}</span>
                        <span>INVOICE Date:- ${new Date(invoice.date).toLocaleDateString()}</span>
                    </div>
                </div>

                <!-- Added gap (padding-top: 40px) -->
                <div class="container" style="padding-top: 40px;">

                    <!-- Main Info Grid -->
                    <table>
                        <tr>
                            <td width="50%">
                                <strong>CONSIGNEE</strong><br>
                                ${invoice.consignee?.name || invoice.clientName}<br>
                                ${invoice.consignee?.address || invoice.clientAddress}<br>
                                GSTIN ${invoice.consignee?.gstin || ''}
                            </td>
                            <td width="50%">
                                <strong>VENDER CODE:- ${invoice.vendorCode || '1006395'}</strong><br><br>
                                <strong>ORDER. No:- ${invoice.orderNo}</strong><br>
                                <strong>ORDER Date:- ${invoice.orderDate ? new Date(invoice.orderDate).toLocaleDateString() : ''}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td width="50%">
                                <strong>OFFICIAL OTHER THAN CONSIGNEE</strong><br>
                                EXCUTIVE ENGINEER<br>
                                400 KV S/S Division UPPTCL ORAI JALAUN (UP)-<br>
                                Pin 285202
                            </td>
                            <td width="50%">
                                <strong>ACCOUNT DETAIL -</strong><br>
                                <strong>A/C No. - ${contact.accountNumber || invoice.accountDetails?.accountNumber}</strong><br>
                                <strong>IFSC Code - ${contact.ifscCode || invoice.accountDetails?.ifscCode}</strong><br>
                                <strong>Bank Name : ${contact.bankName || invoice.accountDetails?.bankName}</strong><br>
                                <strong>Address : ${contact.branch || invoice.accountDetails?.branch}</strong>
                            </td>
                        </tr>
                    </table>

                    <!-- Items Table -->
                    <table class="items-table" style="margin-top: -1px;">
                        <thead>
                            <tr>
                                <th width="5%">Sr.</th>
                                <th width="55%">Description</th>
                                <th width="10%">QTY</th>
                                <th width="15%">Rate</th>
                                <th width="15%">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map((item, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td class="desc">${item.description}</td>
                                    <td>${item.quantity} ${item.unit || 'NOS'}</td>
                                    <td class="amount-col">${item.rate.toFixed(2)}</td>
                                    <td class="amount-col">${item.amount.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                            
                            <!-- Totals -->
                            <tr class="total-row">
                                <td colspan="4" style="text-align: right;">TOTAL</td>
                                <td class="amount-col">${invoice.totalAmount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="text-align: left;"><strong>Contract No:- ${invoice.contractNo || '4200063452'}</strong></td>
                                <td colspan="2">Add C GST @ 9%</td>
                                <td class="amount-col">${((invoice.totalAmount * 0.09)).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="text-align: left;"><strong>DI No:- ${invoice.diNo || '5200065362'}</strong></td>
                                <td colspan="2">Add S GST @ 9%</td>
                                <td class="amount-col">${((invoice.totalAmount * 0.09)).toFixed(2)}</td>
                            </tr>
                            <tr class="total-row">
                                <td colspan="2" style="text-align: left;"><strong>DI Date:- ${invoice.diDate ? new Date(invoice.diDate).toLocaleDateString() : ''}</strong></td>
                                <td colspan="2">Total Invoice Value</td>
                                <td class="amount-col">${invoice.grandTotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </body>
            </html>
        `;

        console.log(`Generating PDF for Ref: ${invoice.invoiceNumber}`);
        
        let launchArgs = ['--no-sandbox', '--disable-setuid-sandbox'];
        
        // Add aggressive flags for Linux/Production (Render/Vercel) to save memory
        if (process.platform !== 'win32') {
            launchArgs = [
                ...launchArgs,
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                // '--single-process', // Removed as it can be unstable
                '--disable-accelerated-2d-canvas',
                '--disable-extensions'
            ];
        }

        try {
            const browser = await puppeteer.launch({ 
                headless: 'new', // Use new headless mode
                args: launchArgs
            });
            const page = await browser.newPage();
            
            // Set content with a reasonable timeout
            await page.setContent(htmlContent, { 
                waitUntil: 'domcontentloaded',
                timeout: 60000 // 60 seconds timeout
            });
            
            const pdfBuffer = await page.pdf({ 
                format: 'A4', 
                printBackground: true 
            });
    
            await browser.close();
            console.log(`PDF Generated successfully`);
    
            res.set('Content-Type', 'application/pdf');
            res.set('Content-Disposition', `attachment; filename=invoice_${invoice.invoiceNumber}.pdf`);
            res.send(pdfBuffer);
        } catch (puppeteerError) {
            console.error('Puppeteer specific error:', puppeteerError);
            throw puppeteerError; // Re-throw to be caught by outer catch
        }

    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ message: 'Error generating PDF: ' + error.message });
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
