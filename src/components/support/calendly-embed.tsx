"use client";

import { useEffect } from "react";
import { Calendar } from "lucide-react";

interface CalendlyEmbedProps {
  url?: string; // Calendly URL (e.g., "https://calendly.com/your-username/discovery-call")
  minWidth?: string;
  height?: string;
  prefill?: {
    name?: string;
    email?: string;
  };
}

// Default Calendly URL - update this with actual URL
const DEFAULT_CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-username/discovery-call";

export function CalendlyEmbed({
  url = DEFAULT_CALENDLY_URL,
  minWidth = "320px",
  height = "700px",
  prefill,
}: CalendlyEmbedProps) {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Build URL with prefill data
  let embedUrl = url;
  if (prefill) {
    const params = new URLSearchParams();
    if (prefill.name) params.append("name", prefill.name);
    if (prefill.email) params.append("email", prefill.email);
    if (params.toString()) {
      embedUrl = `${url}?${params.toString()}`;
    }
  }

  return (
    <div
      className="calendly-inline-widget"
      data-url={embedUrl}
      style={{ minWidth, height }}
    />
  );
}

interface CalendlyButtonProps {
  url?: string;
  text?: string;
  prefill?: {
    name?: string;
    email?: string;
  };
  className?: string;
}

export function CalendlyButton({
  url = DEFAULT_CALENDLY_URL,
  text = "Book Your Free Call",
  prefill,
  className = "",
}: CalendlyButtonProps) {
  const openCalendly = () => {
    // Build URL with prefill data
    let calendlyUrl = url;
    if (prefill) {
      const params = new URLSearchParams();
      if (prefill.name) params.append("name", prefill.name);
      if (prefill.email) params.append("email", prefill.email);
      if (params.toString()) {
        calendlyUrl = `${url}?${params.toString()}`;
      }
    }

    // Open Calendly popup if Calendly is loaded
    if (typeof window !== "undefined" && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({ url: calendlyUrl });
    } else {
      // Fallback: open in new tab
      window.open(calendlyUrl, "_blank");
    }
  };

  useEffect(() => {
    // Load Calendly widget script for popup
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    // Load Calendly CSS
    const link = document.createElement("link");
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <button
      onClick={openCalendly}
      className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg ${className}`}
    >
      <Calendar className="w-5 h-5" />
      <span>{text}</span>
    </button>
  );
}
