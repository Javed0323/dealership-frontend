// CookieBanner.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useCookieConsent } from "@/features/frontend/components/CookieConsentContext";

const CookieBanner: React.FC = () => {
  const { consent, accept, decline } = useCookieConsent();

  // Don't render if user has already decided
  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Message */}
        <p className="text-sm text-gray-400 leading-relaxed">
          We use cookies to analyse site traffic and improve your experience.{" "}
          <Link
            to="/privacy-policy"
            className="text-white underline underline-offset-2 hover:text-gray-300 transition-colors"
          >
            Learn more
          </Link>
          .
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-xs font-medium text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-xs font-medium text-gray-950 bg-white hover:bg-gray-200 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
