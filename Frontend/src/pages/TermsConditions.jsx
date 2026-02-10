import React from 'react';
import { motion } from 'framer-motion';

const TermsConditions = () => {
  return (
    <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-[#8B0000] mb-6 border-b-2 border-[#8B0000] pb-2">
        Terms & Conditions
      </h2>
      
      <div className="space-y-4 text-gray-700 leading-relaxed overflow-y-auto max-h-[70vh] pr-2">
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Agreement to Terms</h3>
          <p>
            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Tanvi Contractor concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Intellectual Property Rights</h3>
          <p>
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">3. User Representations</h3>
          <p>
            By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Use.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Modifications and Interruptions</h3>
          <p>
            We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">5. Governing Law</h3>
          <p>
            These Terms shall be governed by and defined following the laws of India. Tanvi Contractor and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
          </p>
        </section>
        
        <div className="text-sm text-gray-500 mt-6 pt-4 border-t">
          Last Updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
