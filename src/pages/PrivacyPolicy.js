import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-br from-teal-300 via-sky-300 to-indigo-300 min-h-screen">
      <div className="bg-white bg-opacity-80">
        <h1 className="text-4xl font-bold py-8 text-gray-800 text-center">Privacy Policy</h1>
        <div className="w-[94%] ml-[3%] space-y-6 text-gray-700 px-4 pb-8">
          <p>
            At NexterChat API, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines our practices concerning the collection, use, and protection of your data when you use our compiler API service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect the following types of information:
          </p>
          <ul className="list-disc pl-6">
            <li>Account information (e.g., name, email address, company name)</li>
            <li>API usage data (e.g., number of requests, types of compilations)</li>
            <li>Payment information (processed securely through third-party payment providers)</li>
            <li>Technical data (e.g., IP address, browser type, device information)</li>
            <li>User-submitted code for compilation (temporarily stored for processing)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul className="list-disc pl-6">
            <li>Provide and maintain our compiler API service</li>
            <li>Process and complete transactions</li>
            <li>Improve and optimize our API performance</li>
            <li>Communicate with you about your account and service updates</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Detect and prevent fraudulent or unauthorized API usage</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Legal Basis for Processing</h2>
          <p>
            We process your personal data based on the following legal grounds:
          </p>
          <ul className="list-disc pl-6">
            <li>Performance of a contract when we provide you with our API services</li>
            <li>Your consent, which you can withdraw at any time</li>
            <li>Our legitimate interests in improving and securing our services</li>
            <li>Compliance with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data, including encryption, access controls, and regular security audits. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention and Deletion</h2>
          <p>
            We retain your account information and API usage data for as long as your account is active or as needed to provide you services. User-submitted code for compilation is temporarily stored only for the duration necessary to process and return results, after which it is automatically deleted from our systems. You may request the deletion of your account and associated data at any time by contacting our support team.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Third-Party Services</h2>
          <p>
            We may use third-party services for various aspects of our operations, including:
          </p>
          <ul className="list-disc pl-6">
            <li>Payment processing</li>
            <li>Analytics and performance monitoring</li>
            <li>Customer support tools</li>
          </ul>
          <p>
            These services have their own privacy policies, and we encourage you to review them. We only share the minimum amount of information necessary for these services to function.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights and Choices</h2>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc pl-6">
            <li>Access and update your personal information</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Request a copy of your data</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information and comply with applicable data protection laws.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Children's Privacy</h2>
          <p>
            Our services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Cookie Policy</h2>
          <p>
            We use cookies and similar technologies to enhance your experience with our API. You can manage your cookie preferences through your browser settings. For more information, please refer to our separate Cookie Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
          </p>
          <p>
            Email: privacy@nexterchat.com<br />
            Address: [Your Company Address]
          </p>

          <p className="mt-4">
            Last updated: [Insert Date]
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
