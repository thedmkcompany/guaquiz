import Link from "next/link";
import { MessageCircle, Mail, Phone, Clock } from "lucide-react";
import { WhatsAppButton } from "@/components/support";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import { MobileLogoLoop } from "@/components/MobileLogoLoop";
import { Header } from "@/components/ui/header";

export const metadata = {
  title: "Contact Us | DMK",
  description: "Have questions? We're here to help. Reach out via WhatsApp, email, or book a call.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-pastel font-body text-forest">
      {/* Header */}
      <Header variant="back" position="fixed" />

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-60px)] relative overflow-hidden">
        <DecorativeBlobs />

        <div className="max-w-2xl w-full relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-forest mb-4">
              We&apos;re Here to Help
            </h1>
            <p className="text-forest/80 font-body text-lg">
              Have questions about our programs? Want to know which one is right
              for you? Reach out - we typically respond within a few hours.
            </p>
          </div>

          {/* Mobile Logo Loop - Below Hero */}
          <MobileLogoLoop className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8" />

          {/* Contact Options */}
          <div className="space-y-6">
            {/* WhatsApp - Primary */}
            <div className="glass-card rounded-[2rem] shadow-medium hover:shadow-float hover:-translate-y-1 transition-all duration-300 p-6 sm:p-8">
              <div className="flex items-start gap-5 w-full">
                <div className="w-14 h-14 bg-[#25D366]/10 rounded-full flex items-center justify-center flex-shrink-0 border border-[#25D366]/20">
                  <MessageCircle className="w-7 h-7 text-[#25D366]" />
                </div>
                <div className="flex-1">
                  <h2 className="font-headline font-bold text-lg text-forest mb-1">
                    WhatsApp (Fastest)
                  </h2>
                  <p className="text-forest/70 text-sm mb-5 font-body">
                    Chat with us directly. We usually reply within minutes
                    during business hours.
                  </p>
                  <WhatsAppButton
                    message="Hi! I have a question about the programs."
                    className="w-full sm:w-auto rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-md font-semibold px-6 py-3"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="glass-card rounded-[2rem] shadow-medium hover:shadow-float hover:-translate-y-1 transition-all duration-300 p-6 sm:p-8">
              <div className="flex items-start gap-5 w-full">
                <div className="w-14 h-14 bg-wine/10 rounded-full flex items-center justify-center flex-shrink-0 border border-wine/20">
                  <Mail className="w-7 h-7 text-wine" />
                </div>
                <div className="flex-1">
                  <h2 className="font-headline font-bold text-lg text-forest mb-1">Email</h2>
                  <p className="text-forest/70 text-sm mb-5 font-body">
                    For detailed inquiries or if you prefer email
                    communication.
                  </p>
                  <a
                    href="mailto:support@thedmk.in"
                    className="inline-flex items-center gap-2 text-wine font-medium hover:text-wine-light font-subheader text-lg hover:underline underline-offset-4 transition-all"
                  >
                    support@thedmk.in
                  </a>
                </div>
              </div>
            </div>

            {/* Book a Call */}
            <div className="glass-card rounded-[2rem] shadow-medium hover:shadow-float hover:-translate-y-1 transition-all duration-300 p-6 sm:p-8">
              <div className="flex items-start gap-5 w-full">
                <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 border border-gold/20">
                  <Phone className="w-7 h-7 text-gold-dark" />
                </div>
                <div className="flex-1">
                  <h2 className="font-headline font-bold text-lg text-forest mb-1">
                    Book a Call
                  </h2>
                  <p className="text-forest/70 text-sm mb-5 font-body">
                    Prefer to talk? Schedule a free 20-minute discovery call
                    with us.
                  </p>
                  <Link
                    href="/book-call"
                    className="inline-flex items-center gap-2 bg-gold-dark text-white px-8 py-3 rounded-full font-semibold hover:bg-gold transition-all shadow-md hover:-translate-y-0.5"
                  >
                    Schedule a Call
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="mt-8 bg-white/40 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30">
            <div className="flex items-center justify-center gap-2 text-forest/80 mb-2 font-subheader">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Average Response Time</span>
            </div>
            <p className="text-forest/60 text-sm font-body">
              WhatsApp: Within minutes | Email: Within 24 hours
            </p>
          </div>

          {/* FAQ Link */}
          <div className="mt-8 text-center">
            <p className="text-forest/70 mb-2 font-body">Looking for quick answers?</p>
            <Link
              href="/#faq"
              className="text-wine font-semibold hover:text-wine-light hover:underline font-subheader"
            >
              Check our FAQ section
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
