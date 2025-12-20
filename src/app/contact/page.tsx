import { Mail, Clock, Instagram } from "lucide-react";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import { MobileLogoLoop } from "@/components/MobileLogoLoop";
import { Footer } from "@/components/ui/footer";
import { getPageMetadata, siteConfig } from "@/lib/seo-config";

export const metadata = getPageMetadata({
  title: "Contact Us - Get in Touch with Glow Up Academy",
  description:
    "Have questions about our transformation programs? Contact Glow Up Academy via Instagram or email. We're here to help you start your journey to becoming hot and unstoppable.",
  keywords: [
    "contact Glow Up Academy",
    "customer support",
    "transformation consultation",
    "program inquiries",
  ],
  ogImage: "/api/og?page=contact",
  canonical: `${siteConfig.url}/contact`,
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-pastel font-body text-forest">
      {/* Main Content */}
      <main className="pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-60px)] relative overflow-hidden">
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
            {/* Instagram - Primary */}
            <div className="glass-card rounded-[2rem] shadow-medium hover:shadow-float hover:-translate-y-1 transition-all duration-300 p-6 sm:p-8">
              <div className="flex items-start gap-5 w-full">
                <div className="w-14 h-14 bg-gradient-to-br from-wine/20 to-gold/20 rounded-full flex items-center justify-center flex-shrink-0 border border-wine/30">
                  <Instagram className="w-7 h-7 text-wine" />
                </div>
                <div className="flex-1">
                  <h2 className="font-headline font-bold text-lg text-forest mb-1">
                    Instagram DM (Fastest)
                  </h2>
                  <p className="text-forest/70 text-sm mb-5 font-body">
                    Message us directly. We usually reply within minutes
                    during business hours.
                  </p>
                  <a
                    href="https://instagram.com/thedmkco"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 w-full sm:w-auto rounded-full bg-gradient-to-r from-wine to-wine-dark hover:from-wine-dark hover:to-wine text-white shadow-md font-semibold px-6 py-3 transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                    Message @thedmkco
                  </a>
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
                    href="mailto:hello@thedmk.online"
                    className="inline-flex items-center gap-2 text-wine font-medium hover:text-wine-light font-subheader text-lg hover:underline underline-offset-4 transition-all"
                  >
                    hello@thedmk.online
                  </a>
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
              Instagram: Within minutes | Email: Within 24 hours
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
