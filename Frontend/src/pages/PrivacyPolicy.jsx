import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-[#8B0000] mb-6 border-b-2 border-[#8B0000] pb-2">
        Privacy Policy
      </h2>
      
      <div className="space-y-4 text-gray-700 leading-relaxed overflow-y-auto max-h-[70vh] pr-2">
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Introduction</h3>
          <p>
            Welcome to Tanvi Contractor. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Data We Collect</h3>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
          </p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">3. How We Use Your Data</h3>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal or regulatory obligation.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Data Security</h3>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">5. Contact Us</h3>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us via our Contact page.
          </p>
        </section>
        
        <div className="text-sm text-gray-500 mt-6 pt-4 border-t">
          Last Updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
