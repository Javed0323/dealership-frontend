// useAnalytics.ts
import { useEffect } from "react";
import { useCookieConsent } from "@/features/frontend/components/CookieConsentContext";

// Replace with your real GA4 Measurement ID
const GA_MEASUREMENT_ID = "G-VJVB1H1D0B";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function loadGA4() {
  if (document.getElementById("ga4-script")) return; // already loaded

  const script = document.createElement("script");
  script.id = "ga4-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true, // GDPR best practice
  });
}

function disableGA4() {
  // Tell GA4 not to track this user
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
    });
  }
}

/**
 * Drop this hook once in your app root (e.g. App.tsx or PublicLayout.tsx).
 * It watches consent and initialises GA4 only when the user accepts.
 */
export function useAnalytics() {
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (consent === "accepted") {
      loadGA4();
    } else if (consent === "declined") {
      disableGA4();
    }
  }, [consent]);
}
