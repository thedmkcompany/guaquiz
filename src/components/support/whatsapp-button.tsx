"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string; // WhatsApp number with country code (e.g., "919876543210")
  message?: string; // Pre-filled message
  variant?: "fixed" | "inline" | "link";
  className?: string;
}

// Default WhatsApp number - update this with actual number
const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

export function WhatsAppButton({
  phoneNumber = DEFAULT_WHATSAPP_NUMBER,
  message = "Hi! I have a question about the programs.",
  variant = "inline",
  className = "",
}: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  if (variant === "fixed") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 ${className}`}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    );
  }

  if (variant === "link") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
        <span>Chat on WhatsApp</span>
      </a>
    );
  }

  // Default: inline button
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors ${className}`}
    >
      <MessageCircle className="w-5 h-5" />
      <span>Chat on WhatsApp</span>
    </a>
  );
}

// Floating WhatsApp button for global use
export function FloatingWhatsAppButton() {
  return (
    <WhatsAppButton
      variant="fixed"
      message="Hi! I'm interested in learning more about your programs."
    />
  );
}
