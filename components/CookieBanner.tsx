"use client";

import { useState } from "react";
import { useConsent } from "./ConsentProvider";

export default function CookieBanner() {
  const { consent, updateConsent } = useConsent();

  const [customize, setCustomize] = useState(false);

  const [analytics, setAnalytics] = useState(false);

  const [marketing, setMarketing] = useState(false);

  if (consent) return null;

  return (
    <div className="fixed bottom-5 left-5 right-5 bg-white border shadow-2xl rounded-2xl p-6 z-50 max-w-2xl mx-auto">

      <h2 className="text-2xl font-bold mb-3 text-[#1f2d1f]">
        Cookie Preferences
      </h2>

      <p className="text-gray-600 mb-5">
        We use cookies to improve your experience,
        analyze traffic and personalize content.
      </p>

      {customize && (
        <div className="space-y-4 mb-6">

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                Essential Cookies
              </h3>

              <p className="text-sm text-gray-500">
                Required for website functionality.
              </p>
            </div>

            <input
              type="checkbox"
              checked
              disabled
            />
          </div>


          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                Analytics Cookies
              </h3>

              <p className="text-sm text-gray-500">
                Help us understand website usage.
              </p>
            </div>

            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) =>
                setAnalytics(e.target.checked)
              }
            />
          </div>


          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                Marketing Cookies
              </h3>

              <p className="text-sm text-gray-500">
                Used for advertising and remarketing.
              </p>
            </div>

            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) =>
                setMarketing(e.target.checked)
              }
            />
          </div>

        </div>
      )}

      <div className="flex flex-wrap gap-3">

        <button
          onClick={() =>
            updateConsent({
              essential: true,
              analytics: true,
              marketing: true,
            })
          }
          className="bg-black text-white hover:bg-gray-800 px-5 py-2 rounded-lg"
        >
          Accept All
        </button>


        <button
          onClick={() =>
            updateConsent({
              essential: true,
              analytics: false,
              marketing: false,
            })
          }
          className="border px-5 py-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          Reject All
        </button>


        {!customize ? (
          <button
            onClick={() => setCustomize(true)}
            className="border px-5 py-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            Customize
          </button>
        ) : (
          <button
            onClick={() =>
              updateConsent({
                essential: true,
                analytics,
                marketing,
              })
            }
            className="border px-5 py-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            Save Preferences
          </button>
        )}

      </div>

    </div>
  );
}