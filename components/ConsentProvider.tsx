"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ConsentType = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

type ConsentContextType = {
  consent: ConsentType | null;
  updateConsent: (value: ConsentType) => void;
};

const ConsentContext =
  createContext<ConsentContextType | null>(null);

export function ConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consent, setConsent] =
    useState<ConsentType | null>(null);

  useEffect(() => {
    const stored =
      localStorage.getItem("cookieConsent");

    if (stored) {
      setConsent(JSON.parse(stored));
    }
  }, []);

  const updateConsent = (value: ConsentType) => {
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        ...value,
        timestamp: new Date().toISOString(),
      })
    );

    setConsent(value);
  };

  return (
    <ConsentContext.Provider
      value={{
        consent,
        updateConsent,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);

  if (!context) {
    throw new Error(
      "useConsent must be used inside ConsentProvider"
    );
  }

  return context;
}