// components/Accessibility.tsx
import React from "react";
import {
  Eye,
  Keyboard,
  MousePointer,
  Volume2,
  CheckCircle,
} from "lucide-react";

const Accessibility: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accessibility Statement
          </h1>
          <p className="text-lg text-gray-600">
            Auto Elite Motors is committed to ensuring digital accessibility for
            all users.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Commitment */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Commitment
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Auto Elite Motors strives to provide an accessible experience for
              all visitors, regardless of ability or technology. We are actively
              working to ensure our website meets or exceeds WCAG 2.1 Level AA
              standards.
            </p>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Accessibility Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <Keyboard className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Keyboard Navigation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Full site navigation using Tab, Enter, and arrow keys.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Eye className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Screen Reader Compatible
                  </h3>
                  <p className="text-sm text-gray-600">
                    ARIA labels and semantic HTML for assistive technologies.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MousePointer className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Clear Focus Indicators
                  </h3>
                  <p className="text-sm text-gray-600">
                    Visible outlines for keyboard navigation focus.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Volume2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Alternative Text
                  </h3>
                  <p className="text-sm text-gray-600">
                    Descriptive alt text for all images and graphics.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Standards */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Standards Compliance
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We aim to comply with the Web Content Accessibility Guidelines
              (WCAG) 2.1 Level AA, which include requirements for:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Text alternatives for non-text content
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Captions and alternatives for multimedia
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Content that is adaptable to different devices
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Sufficient color contrast for readability
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Keyboard-accessible functionality
              </li>
            </ul>
          </section>

          {/* Feedback */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Feedback & Support
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We welcome your feedback. If you experience any difficulty
              accessing our website, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> (555) 123-4567
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> accessibility@autoelite.com
              </p>
              <p className="text-gray-700">
                <strong>Hours:</strong> Monday-Friday, 9am-5pm PST
              </p>
            </div>
          </section>

          {/* Ongoing Efforts */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ongoing Improvements
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Accessibility is an ongoing commitment. We regularly audit our
              website, train our team, and implement improvements to ensure all
              users have equal access to our products and services.
            </p>
          </section>

          {/* Last Updated */}
          <div className="pt-4 text-sm text-gray-500 border-t border-gray-200">
            <p>Last updated: March 27, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
