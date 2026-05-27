"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  CookieConsentState,
  CookiePreferences,
  DEFAULT_PREFERENCES,
} from "@/types/cookies";

const STORAGE_KEY = "cookie_consent";

interface CookieConsentContextValue {
  consentState: CookieConsentState;
  showBanner: boolean;
  showCustomise: boolean;
  acceptAll: () => void;
  denyAll: () => void;
  saveCustom: (prefs: CookiePreferences) => void;
  openCustomise: () => void;
  closeCustomise: () => void;
  resetConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

function loadFromStorage(): CookieConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsentState;
  } catch {
    return null;
  }
}

function saveToStorage(state: CookieConsentState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consentState, setConsentState] = useState<CookieConsentState>({
    hasConsented: false,
    preferences: DEFAULT_PREFERENCES,
    consentedAt: null,
  });
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomise, setShowCustomise] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setConsentState(stored);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
    setHydrated(true);
  }, []);

  const applyConsent = useCallback((prefs: CookiePreferences) => {
    const newState: CookieConsentState = {
      hasConsented: true,
      preferences: { ...prefs, necessary: true },
      consentedAt: new Date().toISOString(),
    };
    setConsentState(newState);
    saveToStorage(newState);
    setShowBanner(false);
    setShowCustomise(false);
  }, []);

  const acceptAll = useCallback(() => {
    applyConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  }, [applyConsent]);

  const denyAll = useCallback(() => {
    applyConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  }, [applyConsent]);

  const saveCustom = useCallback(
    (prefs: CookiePreferences) => {
      applyConsent(prefs);
    },
    [applyConsent]
  );

  const openCustomise = useCallback(() => setShowCustomise(true), []);
  const closeCustomise = useCallback(() => setShowCustomise(false), []);

  const resetConsent = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setConsentState({
      hasConsented: false,
      preferences: DEFAULT_PREFERENCES,
      consentedAt: null,
    });
    setShowBanner(true);
    setShowCustomise(false);
  }, []);

  if (!hydrated) return <>{children}</>;

  return (
    <CookieConsentContext.Provider
      value={{
        consentState,
        showBanner,
        showCustomise,
        acceptAll,
        denyAll,
        saveCustom,
        openCustomise,
        closeCustomise,
        resetConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used inside CookieConsentProvider");
  }
  return ctx;
}
