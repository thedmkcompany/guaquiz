"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProgramBySlug, formatPrice } from "@/lib/programs";
import { CalendlyEmbed } from "@/components/support";
import {
  Crown,
  Sparkles,
  Mail,
  MessageCircle,
  Calendar,
  Gift,
  ChevronRight,
  Copy,
  Check,
  Share2,
  Users,
} from "lucide-react";
import { useState } from "react";

export function SuccessPageClient() {
  const searchParams = useSearchParams();
  const programSlug = searchParams.get("program") || "";
  const paymentId = searchParams.get("paymentId") || "";
  const customerEmail = searchParams.get("email") || "your email";

  const program = programSlug ? getProgramBySlug(programSlug) : null;
  const [copied, setCopied] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

  // Generate a mock referral code (in production, this would come from backend)
  const referralCode = `DMK${paymentId?.slice(-6)?.toUpperCase() || "QUEEN"}`;
  const referralLink = `https://dmk.com/quiz?ref=${referralCode}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join DMK - Become Hot & Unstoppable",
          text: "I just joined the DMK transformation program! Use my link and we both get ₹500 credit.",
          url: referralLink,
        });
      } catch {
        handleCopyReferral();
      }
    } else {
      handleCopyReferral();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory via-beige-light to-ivory">
      {/* Hero Section */}
      <section className="pt-12 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Crown Animation */}
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-gold-light via-gold to-gold-dark rounded-full flex items-center justify-center shadow-xl animate-pulse">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-gold animate-bounce" />
            <Sparkles className="absolute -bottom-1 -left-3 w-6 h-6 text-wine animate-bounce delay-100" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-charcoal mb-3">
            Welcome to DMK, Queen 👑
          </h1>

          <p className="text-xl text-wine font-medium mb-6">
            Your transformation starts now
          </p>

          {/* Email Confirmation */}
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-beige">
            <Mail className="w-5 h-5 text-wine" />
            <span className="text-slate">Receipt sent to</span>
            <span className="font-semibold text-charcoal">{customerEmail}</span>
          </div>

          {/* Program Badge */}
          {program && (
            <div className="mt-6 inline-block bg-wine/10 text-wine px-4 py-2 rounded-lg text-sm font-medium">
              {program.name} • {formatPrice(program.price)}
            </div>
          )}
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold font-headline text-charcoal text-center mb-8">
            Your Next Steps
          </h2>

          <div className="space-y-4">
            {/* Step 1: Check Email */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-beige hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-wine/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-wine">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-charcoal text-lg mb-1">
                    Check your email for welcome guide
                  </h3>
                  <p className="text-slate text-sm mb-3">
                    We&apos;ve sent you everything you need to get started. Check your inbox (and spam folder, just in case!)
                  </p>
                  <div className="flex items-center gap-2 text-wine text-sm font-medium">
                    <Mail className="w-4 h-4" />
                    <span>Sent to {customerEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Join WhatsApp */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-beige hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-forest">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-charcoal text-lg mb-1">
                    Join your private community
                  </h3>
                  <p className="text-slate text-sm mb-3">
                    Connect with your fellow queens in our exclusive WhatsApp community. Get support, share wins, and stay accountable!
                  </p>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}?text=Hi! I just joined ${program?.name || "DMK"}. Please add me to the community!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-lg font-medium hover:bg-forest-light transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Join WhatsApp Community
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Step 3: Book Welcome Call */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-beige hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-gold-dark">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-charcoal text-lg mb-1">
                    Book your welcome call
                  </h3>
                  <p className="text-slate text-sm mb-3">
                    Schedule a quick 15-minute call with your success coach to customize your journey and answer any questions.
                  </p>
                  {!showCalendly ? (
                    <button
                      onClick={() => setShowCalendly(true)}
                      className="inline-flex items-center gap-2 btn-gold px-5 py-2.5 rounded-lg font-medium"
                    >
                      <Calendar className="w-5 h-5" />
                      Book Welcome Call
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="mt-4 border border-beige rounded-xl overflow-hidden">
                      <CalendlyEmbed height="500px" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Excitement Builder Section */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Sparkles className="w-8 h-8 text-wine mx-auto mb-3" />
            <h2 className="text-2xl font-bold font-headline text-charcoal">
              What happens next
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-wine via-gold to-forest" />

            <div className="space-y-6">
              {/* Day 1 */}
              <div className="flex gap-4 relative">
                <div className="w-12 h-12 bg-wine rounded-full flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg">
                  Day 1
                </div>
                <div className="flex-1 bg-wine/5 rounded-xl p-4 border border-wine/20">
                  <h4 className="font-semibold text-charcoal mb-1">
                    Welcome email + access to member portal
                  </h4>
                  <p className="text-sm text-slate">
                    Log in to your personal dashboard and explore all your resources
                  </p>
                </div>
              </div>

              {/* Day 2 */}
              <div className="flex gap-4 relative">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-charcoal font-bold text-sm z-10 shadow-lg">
                  Day 2
                </div>
                <div className="flex-1 bg-gold/5 rounded-xl p-4 border border-gold/20">
                  <h4 className="font-semibold text-charcoal mb-1">
                    First workout + habit tracker
                  </h4>
                  <p className="text-sm text-slate">
                    Start your transformation with Day 1 of your personalized plan
                  </p>
                </div>
              </div>

              {/* Day 7 */}
              <div className="flex gap-4 relative">
                <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg">
                  Day 7
                </div>
                <div className="flex-1 bg-forest/5 rounded-xl p-4 border border-forest/20">
                  <h4 className="font-semibold text-charcoal mb-1">
                    First milestone check-in
                  </h4>
                  <p className="text-sm text-slate">
                    Celebrate your first week wins with the community!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Image Placeholder */}
          <div className="mt-8 bg-gradient-to-br from-beige-light to-beige rounded-2xl p-8 text-center">
            <Users className="w-16 h-16 text-wine mx-auto mb-4" />
            <p className="text-wine font-medium">
              Join 500+ queens already transforming their lives
            </p>
            <p className="text-sm text-slate mt-2">
              Our community celebrates every win, big or small
            </p>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-gold/10 to-beige">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold/20 text-gold-dark px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Gift className="w-4 h-4" />
            Refer & Earn
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-headline text-charcoal mb-3">
            Know a queen who needs this?
          </h2>

          <p className="text-slate mb-8">
            Share your referral link and get <span className="font-bold text-wine">₹500 credit</span> for each friend who joins!
          </p>

          {/* Referral Link Box */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-beige mb-6">
            <p className="text-xs text-slate uppercase tracking-wider mb-2">Your Referral Link</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 bg-beige-light border border-beige rounded-lg px-4 py-3 text-sm text-charcoal font-mono"
              />
              <button
                onClick={handleCopyReferral}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  copied
                    ? "bg-forest text-white"
                    : "bg-forest text-white hover:bg-forest-light"
                }`}
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 btn-wine px-6 py-3 rounded-xl font-semibold shadow-lg"
            >
              <Share2 className="w-5 h-5" />
              Share with Friends
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`I just joined DMK and it's amazing! 👑 Use my link to get started: ${referralLink}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-forest text-white px-6 py-3 rounded-xl font-semibold hover:bg-forest-light transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Share on WhatsApp
            </a>
          </div>

          {/* Referral Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-beige">
              <p className="text-3xl font-bold text-wine">₹500</p>
              <p className="text-sm text-slate">Per referral</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-beige">
              <p className="text-3xl font-bold text-gold-dark">Unlimited</p>
              <p className="text-sm text-slate">Referrals allowed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-8 px-4 bg-forest text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-white/70 mb-4">
            Questions? We&apos;re here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 text-white hover:text-gold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with us
            </Link>
            <span className="hidden sm:block text-white/50">|</span>
            <a
              href="mailto:support@dmk.com"
              className="inline-flex items-center justify-center gap-2 text-white hover:text-gold transition-colors"
            >
              <Mail className="w-4 h-4" />
              support@dmk.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
