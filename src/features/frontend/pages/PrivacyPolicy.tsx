// components/PrivacyPolicy.tsx
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">Last updated: March 27, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Auto Elite Motors, we respect your privacy and are committed to
              protecting your personal information. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when
              you visit our website or interact with our dealership.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please read this privacy policy carefully. If you do not agree
              with the terms of this privacy policy, please do not access the
              site.
            </p>
          </section>

          {/* Information Collection */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Personal Data
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  We may collect personal information that you voluntarily
                  provide to us when you:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Fill out contact forms or request information</li>
                  <li>Apply for financing or credit</li>
                  <li>Schedule a test drive or service appointment</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Submit a trade-in valuation request</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">
                  This information may include your name, email address, phone
                  number, address, and financial information.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Automatically Collected Information
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  When you visit our website, we automatically collect certain
                  information about your device, including information about
                  your web browser, IP address, time zone, and some of the
                  cookies that are installed on your device.
                </p>
              </div>
            </div>
          </section>

          {/* Use of Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Process your vehicle inquiries and requests</li>
              <li>Facilitate financing applications</li>
              <li>Schedule and confirm appointments</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Sharing Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Sharing Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may share your information with third-party service providers
              who assist us in operating our business, such as financing
              partners, credit bureaus, and marketing platforms. We do not sell
              your personal information to third parties.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security
              measures to protect your personal information. However, no method
              of transmission over the Internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Privacy Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              To exercise these rights, please contact us using the information
              below.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              If you have questions or concerns about this Privacy Policy,
              please contact us at:
            </p>
            <div className="text-gray-700 leading-relaxed">
              <p>Auto Elite Motors</p>
              <p>123 Auto Avenue, Los Angeles, CA 90001</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: privacy@autoelitemotors.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
