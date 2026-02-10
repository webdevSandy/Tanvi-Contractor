import React from 'react';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
  return (
    <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-[#8B0000] mb-6 border-b-2 border-[#8B0000] pb-2">
        Refund Policy
      </h2>
      
      <div className="space-y-4 text-gray-700 leading-relaxed overflow-y-auto max-h-[70vh] pr-2">
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Overview</h3>
          <p>
            At Tanvi Contractor, our goal is to ensure your complete satisfaction with our services. If, for any reason, you are not satisfied with the services provided, please review our refund policy below.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Service Cancellation</h3>
          <p>
            You may cancel a service request within 24 hours of booking for a full refund. Cancellations made after 24 hours but before the service has commenced may be subject to a cancellation fee.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Refund Eligibility</h3>
          <p>
            Refunds are generally processed under the following conditions:
          </p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Service was not provided as described.</li>
            <li>Service was cancelled by Tanvi Contractor due to unforeseen circumstances.</li>
            <li>Double payment was made by error.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Process for Refund</h3>
          <p>
            To request a refund, please contact us at our provided email address with your order details and reason for the request. We will review your request and notify you of the approval or rejection of your refund within 5-7 business days.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">5. Contact Us</h3>
          <p>
            If you have any questions about our Refund Policy, please contact us through our website's contact form or call us at our support number.
          </p>
        </section>
        
        <div className="text-sm text-gray-500 mt-6 pt-4 border-t">
          Last Updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
