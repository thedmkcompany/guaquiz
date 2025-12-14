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
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";

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
    <div className="min-h-screen bg-gradient-pastel font-body relative overflow-hidden">
      <DecorativeBlobs />

      {/* Hero Section */}
      <section className="pt-12 pb-8 px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Crown Animation */}
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-gold-light via-gold to-gold-dark rounded-full flex items-center justify-center shadow-glow-gold animate-pulse">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-gold animate-bounce" />
            <Sparkles className="absolute -bottom-1 -left-3 w-6 h-6 text-wine animate-bounce delay-100" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-forest mb-3">
            Welcome to DMK, Queen <span className="text-3xl align-top">👑</span>
          </h1>

          <p className="text-xl text-wine font-medium font-subheader mb-6">
            Your transformation starts now
          </p>

          {/* Email Confirmation */}
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-white/50">
            <Mail className="w-5 h-5 text-wine" />
            <span className="text-forest/70">Receipt sent to</span>
            <span className="font-semibold text-forest">{customerEmail}</span>
          </div>

          {/* Program Badge */}
          {program && (
            <div className="mt-6 inline-block bg-wine/10 border border-wine/20 text-wine px-4 py-2 rounded-full text-sm font-subheader font-medium">
              {program.name} • {formatPrice(program.price)}
            </div>
          )}
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="py-8 px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold font-headline text-forest text-center mb-8">
            Your Next Steps
          </h2>

          <div className="space-y-4">
            {/* Step 1: Check Email */}
            <div className="glass-card rounded-[2rem] shadow-medium hover:shadow-float hover:-translate-y-1 transition-all duration-300 border border-white/60 p-6">
              <div className="flex items-start gap-4 w-full">
                <div className="w-12 h-12 bg-wine/10 rounded-full flex items-center justify-center flex-shrink-0 border border-wine/20">
                  <span className="text-xl font-bold text-wine font-headline">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-forest text-lg mb-1 font-headline">
                    Check your email for welcome guide
                  </h3>
                  <p className="text-forest/70 text-sm mb-3 font-body">
                    We&apos;ve sent you everything you need to get started. Check your inbox (and spam folder, just in case!)
                  </p>
                  <div className="flex items-center gap-2 text-wine text-sm font-medium font-subheader">
                    <Mail className="w-4 h-4" />
                    <span>Sent to {customerEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Join WhatsApp */}
            <div className="glass-card rounded-[2rem] shadow-medium hover:shadow-float hover:-translate-y-1 transition-all duration-300 border border-white/60 p-6">
              <div className="flex items-start gap-4 w-full">
                <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0 border border-forest/20">
                  <span className="text-xl font-bold text-forest font-headline">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-forest text-lg mb-1 font-headline">
                    Join your private community
                  </h3>
                  <p className="text-forest/70 text-sm mb-3 font-body">
                    Connect with your fellow queens in our exclusive WhatsApp community. Get support, share wins, and stay accountable!
                  </p>
                  <a
                    href={`https://wa.aisensy.com/+918106139900?text=${encodeURIComponent(`Hi! I just joined ${program?.name || "DMK"}. Please add me to the community!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#128C7E] transition-colors shadow-md font-subheader"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Join WhatsApp Community
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Step 3: Book Welcome Call */}
            <div className="glass-card rounded-[2rem] shadow-medium hover:shadow-float hover:-translate-y-1 transition-all duration-300 border border-white/60 p-6">
              <div className="flex items-start gap-4 w-full">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 border border-gold/20">
                  <span className="text-xl font-bold text-gold-dark font-headline">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-forest text-lg mb-1 font-headline">
                    Book your welcome call
                  </h3>
                  <p className="text-forest/70 text-sm mb-3 font-body">
                    Schedule a quick 15-minute call with your success coach to customize your journey and answer any questions.
                  </p>
                  {!showCalendly ? (
                    <button
                      onClick={() => setShowCalendly(true)}
                      className="inline-flex items-center gap-2 bg-gold text-forest px-6 py-2.5 rounded-full font-medium hover:bg-gold-light transition-colors shadow-md font-subheader"
                    >
                      <Calendar className="w-5 h-5" />
                      Book Welcome Call
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="mt-4 border border-white/40 rounded-[1.5rem] overflow-hidden bg-white">
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
      <section className="py-8 px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Sparkles className="w-8 h-8 text-gold mx-auto mb-3" />
            <h2 className="text-2xl font-bold font-headline text-forest">
              What happens next
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-wine via-gold to-forest opacity-30" />

            <div className="space-y-6">
              {/* Day 1 */}
              <div className="flex gap-4 relative">
                <div className="w-12 h-12 bg-wine rounded-full flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg border-2 border-white">
                  Day 1
                </div>
                <div className="glass-card rounded-3xl shadow-medium border border-white/50 flex-1 p-5 flex flex-col">
                  <h4 className="font-bold text-forest mb-1 font-headline">
                    Welcome email + access to member portal
                  </h4>
                  <p className="text-sm text-forest/70 font-body">
                    Log in to your personal dashboard and explore all your resources
                  </p>
                </div>
              </div>

              {/* Day 2 */}
              <div className="flex gap-4 relative">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-forest font-bold text-sm z-10 shadow-lg border-2 border-white">
                  Day 2
                </div>
                <div className="glass-card rounded-3xl shadow-medium border border-white/50 flex-1 p-5 flex flex-col">
                  <h4 className="font-bold text-forest mb-1 font-headline">
                    First workout + habit tracker
                  </h4>
                  <p className="text-sm text-forest/70 font-body">
                    Start your transformation with Day 1 of your personalized plan
                  </p>
                </div>
              </div>

              {/* Day 7 */}
              <div className="flex gap-4 relative">
                <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg border-2 border-white">
                  Day 7
                </div>
                <div className="glass-card rounded-3xl shadow-medium border border-white/50 flex-1 p-5 flex flex-col">
                  <h4 className="font-bold text-forest mb-1 font-headline">
                    First milestone check-in
                  </h4>
                  <p className="text-sm text-forest/70 font-body">
                    Celebrate your first week wins with the community!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Image Placeholder */}
          <div className="glass-card rounded-[2rem] mt-8 border border-white/60 p-8 text-center flex flex-col items-center">
            <Users className="w-16 h-16 text-wine mx-auto mb-4" />
            <p className="text-wine font-medium font-subheader text-lg">
              Join 500+ queens already transforming their lives
            </p>
            <p className="text-sm text-forest/70 mt-2 font-body">
              Our community celebrates every win, big or small
            </p>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section className="py-12 px-4 relative z-10">
        <div className="glass-card rounded-[2.5rem] max-w-2xl mx-auto shadow-float border border-white/60 overflow-hidden relative p-8 sm:p-10 flex flex-col">
           {/* Glow effect */}
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center relative z-10 w-full">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold-dark px-4 py-2 rounded-full text-sm font-medium mb-6 font-subheader">
              <Gift className="w-4 h-4" />
              Refer & Earn
            </div>

            <h2 className="text-2xl md:text-3xl font-bold font-headline text-forest mb-3">
              Know a queen who needs this?
            </h2>

            <p className="text-forest/80 mb-8 font-body">
              Share your referral link and get <span className="font-bold text-wine">₹500 credit</span> for each friend who joins!
            </p>

            {/* Referral Link Box */}
            <div className="bg-white/50 rounded-2xl p-4 shadow-inner border border-white/40 mb-8 backdrop-blur-sm w-full">
              <p className="text-xs text-forest/60 uppercase tracking-wider mb-2 font-subheader">Your Referral Link</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-sm text-forest font-mono outline-none"
                />
                <button
                  onClick={handleCopyReferral}
                  className={`px-4 py-3 rounded-xl font-medium transition-all shadow-sm ${
                    copied
                      ? "bg-forest text-white"
                      : "bg-white text-forest hover:bg-forest/5 border border-forest/10"
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
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 w-full">
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 btn-wine px-6 py-3 rounded-full font-semibold shadow-lg hover:-translate-y-1 transition-all font-subheader"
              >
                <Share2 className="w-5 h-5" />
                Share with Friends
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`I just joined DMK and it's amazing! 👑 Use my link to get started: ${referralLink}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#128C7E] shadow-lg hover:-translate-y-1 transition-all font-subheader"
              >
                <MessageCircle className="w-5 h-5" />
                Share on WhatsApp
              </a>
            </div>

            {/* Referral Stats */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-white/40 rounded-2xl p-4 border border-white/50 backdrop-blur-sm">
                <p className="text-3xl font-bold text-wine font-headline">₹500</p>
                <p className="text-sm text-forest/60 font-body">Per referral</p>
              </div>
              <div className="bg-white/40 rounded-2xl p-4 border border-white/50 backdrop-blur-sm">
                <p className="text-3xl font-bold text-gold-dark font-headline">Unlimited</p>
                <p className="text-sm text-forest/60 font-body">Referrals allowed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4 bg-forest text-center relative z-10 mt-8 rounded-t-[3rem]">
        <div className="max-w-2xl mx-auto">
          <p className="text-white/70 mb-6 font-body">
            Questions? We&apos;re here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 text-white hover:text-gold transition-colors font-subheader"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with us
            </Link>
            <span className="hidden sm:block text-white/30">|</span>
            <a
              href="mailto:support@thedmk.in"
              className="inline-flex items-center justify-center gap-2 text-white hover:text-gold transition-colors font-subheader"
            >
              <Mail className="w-4 h-4" />
              support@thedmk.in
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
