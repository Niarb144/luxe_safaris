export type CookieCategory = "necessary" | "analytics" | "marketing" | "preferences";

export interface CookiePreferences {
  necessary: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface CookieConsentState {
  hasConsented: boolean;
  preferences: CookiePreferences;
  consentedAt: string | null;
}

export const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

export const COOKIE_DESCRIPTIONS: Record<
  CookieCategory,
  { label: string; description: string }
> = {
  necessary: {
    label: "Necessary",
    description:
      "Essential for the website to function. Cannot be disabled. These include session management, security, and basic functionality.",
  },
  analytics: {
    label: "Analytics",
    description:
      "Help us understand how visitors interact with the site by collecting and reporting information anonymously (e.g. Google Analytics).",
  },
  marketing: {
    label: "Marketing",
    description:
      "Used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.",
  },
  preferences: {
    label: "Preferences",
    description:
      "Allow the website to remember choices you make (e.g. language, region) to provide a more personalised experience.",
  },
};
