import React, { useEffect } from 'react';

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-br from-teal-300 via-sky-300 to-indigo-300 min-h-screen">
      <div className=" bg-white bg-opacity-80">
        <h1 className="text-4xl font-bold py-8 text-gray-800 text-center">Terms and Conditions</h1>
        <div className=" w-[94%] ml-[3%] space-y-6 text-gray-700 px-4 pb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">OVERVIEW</h2>
          <p>
            Welcome to NexterChat API, a service provided by Hysteresis Pvt Ltd. We are excited to offer you a range of innovative solutions designed to enhance your communication experiences. These Terms of Use ("Terms") govern your access to and use of our website and services (collectively, "Services"). By accessing or using our Services, you agree to comply with these Terms. If you do not agree, we kindly ask you to refrain from using our Services. We may update these Terms occasionally, and your continued use signifies acceptance of any changes.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. License to Use Services</h2>
          <p>
            Hysteresis Pvt Ltd grants you a limited, non-exclusive, non-transferable license to access and utilize our Services for your internal business purposes. This license allows you to enjoy the full benefits of our Services while ensuring that our intellectual property rights remain protected. We are here to support your success!
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Age Requirement</h2>
          <p>
            To use our Services, you must be at least 18 years old. If you are under 18, you may use our Services only with parental or guardian consent. We encourage responsible use and welcome young users under the guidance of an adult.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information Accuracy</h2>
          <p>
            At Hysteresis Pvt Ltd, we strive to provide accurate and up-to-date information on our website. While we work hard to ensure the quality of our content, we encourage you to verify any important details. Your informed decisions are our priority!
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Modifications to the Service</h2>
          <p>
            We are committed to continuous improvement and may modify, suspend, or discontinue any aspect of our Services at any time. If significant changes occur, we will notify you in advance. We appreciate your understanding and flexibility as we evolve.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Payment Information</h2>
          <p>
            We offer a variety of subscription plans to suit your needs. By selecting a plan, you authorize us to process your payment details. Please keep your account information current to ensure seamless service. We will notify you of any changes to subscription fees in advance, ensuring transparency and clarity.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Optional Tools</h2>
          <p>
            Our website may offer access to third-party tools. These tools are provided "as is," and we encourage you to explore them responsibly. Your experience matters, so ensure you review the terms associated with these tools before use.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Third-Party Links</h2>
          <p>
            You may encounter links to third-party websites in our Services. While we don't endorse these sites, we believe in providing you with a wide range of resources. Please take a moment to review their terms and policies, as we cannot be responsible for their content.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. User Feedback and Contributions</h2>
          <p>
            We value your feedback! When you share your thoughts, ideas, or suggestions with us, you grant Hysteresis Pvt Ltd the right to use that information to improve our Services. Your contributions help us grow, and we appreciate your engagement!
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Personal Information</h2>
          <p>
            Your privacy is important to us. Our collection and use of personal information are governed by our Privacy Policy. By using our Services, you consent to our practices, and we commit to protecting your data.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Prohibited Activities</h2>
          <p>
            To maintain a positive environment, we ask that you refrain from engaging in any unlawful or disruptive activities. Our goal is to foster a safe and enjoyable experience for all users, and we appreciate your cooperation.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Limitation of Liability</h2>
          <p>
            Hysteresis Pvt Ltd strives to provide a seamless experience. While we work hard to ensure quality, we cannot guarantee uninterrupted service. Our liability is limited to the amount you have paid for the Services, and we appreciate your understanding.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable, the remaining provisions will continue to be effective. We believe in the integrity of our Terms and strive to maintain clarity in our agreements.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">13. Entire Agreement</h2>
          <p>
            These Terms, along with our Privacy Policy, represent the complete agreement between you and Hysteresis Pvt Ltd regarding your use of our Services. We appreciate your trust and aim to provide you with exceptional service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">14. Changes to Terms</h2>
          <p>
            We may occasionally revise these Terms to reflect changes in our practices. The latest version will always be available on our website. We encourage you to check back periodically, as your continued use signifies your acceptance of any updates.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">15. Contact Information</h2>
          <p>
            We're here for you! If you have any questions or feedback, please reach out to us at support@hysterchat.com or visit our contact page. Your input is valuable, and we look forward to hearing from you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
