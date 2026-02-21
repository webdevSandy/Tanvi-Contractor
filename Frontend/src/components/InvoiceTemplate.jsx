import React, { forwardRef } from 'react';
import TemplatePremium from './templates/TemplatePremium';
import TemplateClassic from './templates/TemplateClassic';
import TemplateModern from './templates/TemplateModern';

const InvoiceTemplate = forwardRef(({ invoice, contact }, ref) => {
    if (!invoice) return null;

    // Default contact if none provided
    const defaultContact = {
        gstin: '09ELJPK1174H2ZV',
        pan: 'ELJPK1174H',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branch: '',
        activeTemplate: 'premium'
    };

    const displayContact = contact || defaultContact;
    const activeTemplate = displayContact.activeTemplate || 'premium';

    switch (activeTemplate) {
        case 'classic':
            return <TemplateClassic invoice={invoice} displayContact={displayContact} ref={ref} />;
        case 'modern':
            return <TemplateModern invoice={invoice} displayContact={displayContact} ref={ref} />;
        case 'premium':
        default:
            return <TemplatePremium invoice={invoice} displayContact={displayContact} ref={ref} />;
    }
});

export default InvoiceTemplate;
