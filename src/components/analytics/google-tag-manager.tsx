"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GTM_SERVER_ID = process.env.NEXT_PUBLIC_GTM_SERVER_ID;

/**
 * Delayed GTM loading - only loads after user interaction or 5s timeout
 * This significantly reduces initial page load time and main thread work
 */
export function GoogleTagManager() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const hasGtm = GTM_ID || GTM_SERVER_ID;

  useEffect(() => {
    if (!hasGtm) return;

    // Load after first user interaction
    const events = ["scroll", "click", "touchstart", "keydown"];
    let loaded = false;

    const loadGTM = () => {
      if (loaded) return;
      loaded = true;
      setShouldLoad(true);
      // Clean up listeners
      events.forEach((event) => {
        window.removeEventListener(event, loadGTM, { capture: true });
      });
    };

    // Add interaction listeners
    events.forEach((event) => {
      window.addEventListener(event, loadGTM, { capture: true, passive: true });
    });

    // Fallback: load after 5 seconds if no interaction
    const timeout = setTimeout(loadGTM, 5000);

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => {
        window.removeEventListener(event, loadGTM, { capture: true });
      });
    };
  }, [hasGtm]);

  if (!hasGtm || !shouldLoad) return null;

  return (
    <>
      {/* Client-side GTM */}
      {GTM_ID && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      )}
      {/* Server-side GTM */}
      {GTM_SERVER_ID && (
        <Script
          id="gtm-server-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_SERVER_ID}');
            `,
          }}
        />
      )}
    </>
  );
}

export function GoogleTagManagerNoScript() {
  const hasGtm = GTM_ID || GTM_SERVER_ID;
  if (!hasGtm) return null;

  return (
    <noscript>
      {GTM_ID && (
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      )}
      {GTM_SERVER_ID && (
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_SERVER_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      )}
    </noscript>
  );
}
