// components/TermsOfService.tsx
import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">Last updated: March 27, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Agreement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Agreement to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using the Auto Elite Motors website, you agree to
              be bound by these Terms of Service. If you disagree with any part
              of the terms, you may not access the website or use our services.
            </p>
          </section>

          {/* Vehicle Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Vehicle Information & Pricing
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to provide accurate vehicle descriptions, pricing, and
              availability. However:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Prices are subject to change without notice</li>
              <li>Vehicles are subject to prior sale</li>
              <li>
                Manufacturer incentives may vary by region and eligibility
              </li>
              <li>
                We reserve the right to correct errors in pricing or vehicle
                information
              </li>
              <li>
                All vehicles are sold "as-is" unless otherwise specified with a
                manufacturer warranty
              </li>
            </ul>
          </section>

          {/* Financing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Financing & Credit Applications
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Financing is subject to credit approval through our lending
              partners. The terms of any financing offer are determined by the
              lender and may vary based on credit history, down payment, and
              vehicle qualifications. We do not guarantee approval or specific
              interest rates.
            </p>
          </section>

          {/* Trade-Ins */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Trade-In Valuation
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Online trade-in estimates are preliminary and based on the
              information you provide. The final trade-in value is subject to
              physical inspection of the vehicle, including its condition,
              mileage, and market factors. We reserve the right to adjust the
              offer after inspection.
            </p>
          </section>

          {/* Appointments */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Test Drive & Service Appointments
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Test drive and service appointments are subject to availability.
              We require 24-hour notice for cancellations or rescheduling. A
              valid driver's license and insurance are required for all test
              drives.
            </p>
          </section>

          {/* Deposits */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Vehicle Deposits
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may accept deposits to hold vehicles. Deposits are refundable
              unless the vehicle is specially ordered or modified at customer
              request. Terms of deposits will be clearly communicated at the
              time of deposit.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, Auto Elite Motors shall
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of our
              website or services.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time.
              Changes will be effective immediately upon posting to the website.
              Your continued use of the site constitutes acceptance of the
              modified terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service shall be governed by and construed in
              accordance with the laws of the State of California, without
              regard to its conflict of law provisions.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="text-gray-700 leading-relaxed">
              <p>Auto Elite Motors</p>
              <p>123 Auto Avenue, Los Angeles, CA 90001</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: legal@autoelitemotors.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
