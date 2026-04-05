// CookieConsentContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

type ConsentStatus = "accepted" | "declined" | null;

interface CookieConsentContextValue {
  consent: ConsentStatus;
  accept: () => void;
  decline: () => void;
}

const STORAGE_KEY = "cookie_consent";
const CONSENT_EXPIRY_DAYS = 180; // re-ask after 6 months

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

function getStoredConsent(): ConsentStatus {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { status, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return status;
  } catch {
    return null;
  }
}

function storeConsent(status: "accepted" | "declined") {
  const expiresAt = Date.now() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ status, expiresAt }));
}

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [consent, setConsent] = useState<ConsentStatus>(null);

  useEffect(() => {
    setConsent(getStoredConsent());
  }, []);

  const accept = () => {
    storeConsent("accepted");
    setConsent("accepted");
  };

  const decline = () => {
    storeConsent("declined");
    setConsent("declined");
  };

  return (
    <CookieConsentContext.Provider value={{ consent, accept, decline }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx)
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider",
    );
  return ctx;
}
