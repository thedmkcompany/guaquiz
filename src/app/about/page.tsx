import Link from "next/link";
import { Heart, Users, Sparkles, Award, CheckCircle2 } from "lucide-react";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import { Footer } from "@/components/ui/footer";
import { getPageMetadata, siteConfig } from "@/lib/seo-config";

export const metadata = getPageMetadata({
  title: "About Us - Meet Disha & The Glow Up Academy Story",
  description:
    "Meet Disha Methi Khandelwal, founder of Glow Up Academy. Master's in Applied Finance turned transformation coach. 2,500+ women transformed, 5,000+ sessions conducted. Learn about our holistic approach to fitness, beauty, finance, and confidence for Indian women.",
  keywords: [
    "Disha Methi Khandelwal",
    "about Glow Up Academy",
    "transformation coach India",
    "women empowerment India",
    "holistic wellness",
    "founder story",
  ],
  ogImage: "/api/og?page=about",
  canonical: `${siteConfig.url}/about`,
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-pastel font-body text-forest">
      {/* Main Content */}
      <main className="pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <DecorativeBlobs />

        <article className="max-w-4xl mx-auto relative z-10">
          {/* Hero Section */}
          <div className="glass-card rounded-[2rem] shadow-medium p-6 sm:p-10 lg:p-12 mb-8">
            <header className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-forest mb-6">
                Transforming Lives Through Fitness, Nutrition, and Confidence
              </h1>
              <p className="text-lg text-forest/80 leading-relaxed max-w-2xl mx-auto">
                Welcome to The DMK, where we believe that true transformation goes beyond physical changes. We are a premium fitness and wellness company dedicated to empowering Indian women to become the strongest, most confident versions of themselves.
              </p>
            </header>
          </div>

          {/* Our Story */}
          <div className="glass-card rounded-[2rem] shadow-medium p-6 sm:p-10 lg:p-12 mb-8">
            <h2 className="text-2xl font-headline font-bold text-forest mb-6 flex items-center gap-3">
              <Heart className="w-7 h-7 text-wine" />
              Our Story
            </h2>
            <div className="space-y-4 text-forest/80 leading-relaxed">
              <p>
                The DMK was founded on a simple yet powerful belief that every woman deserves to feel confident, energized, and capable in her own body. What began as a passion for helping women achieve their fitness goals has evolved into a comprehensive wellness ecosystem that addresses the mind, body, and spirit.
              </p>
              <p>
                We recognized that traditional fitness programs often focus solely on physical results, neglecting the mental and emotional aspects of transformation. This gap inspired us to create something different, a holistic approach that combines evidence-based fitness coaching, personalized nutrition guidance, and mindset work to create lasting change.
              </p>
              <p>
                Today, we operate under three distinct brands, each serving a unique purpose in our mission to transform lives:
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" />
                  <span><strong className="text-forest">The DMK</strong> offers comprehensive transformation programs for women ready to commit to significant lifestyle changes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" />
                  <span><strong className="text-forest">The Inner Circle</strong> provides an exclusive community for high-achievers seeking continuous support and accountability.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" />
                  <span><strong className="text-forest">The Confidence Club</strong> creates a vibrant, supportive environment where women connect, grow, and celebrate their journeys together.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pull Quote Divider */}
          <div className="text-center py-6 mb-8">
            <p className="font-accent text-xl sm:text-2xl italic text-wine/80 max-w-2xl mx-auto leading-relaxed">
              &ldquo;True transformation goes beyond the physical &mdash; it&apos;s a complete reinvention of how you show up in life.&rdquo;
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
          </div>

          {/* Our Mission */}
          <div className="glass-card rounded-[2rem] shadow-medium p-6 sm:p-10 lg:p-12 mb-8">
            <h2 className="text-2xl font-headline font-bold text-forest mb-6 flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-gold-dark" />
              Our Mission
            </h2>
            <div className="space-y-4 text-forest/80 leading-relaxed">
              <p>
                We exist to empower Indian women aged twenty-five to forty-five to reclaim their health, confidence, and vitality through sustainable fitness and wellness practices. We believe that transformation is not just about losing weight or building muscle but about discovering your inner strength, developing unshakeable confidence, and creating a lifestyle that makes you feel alive.
              </p>
              <p>
                Our mission extends beyond individual transformations. We are building a movement of empowered women who support each other, celebrate victories together, and inspire the next generation to prioritize their health and wellbeing.
              </p>
            </div>
          </div>

          {/* Our Approach - Icon Grid */}
          <div className="glass-card rounded-[2rem] shadow-medium p-6 sm:p-10 lg:p-12 mb-8">
            <h2 className="text-2xl font-headline font-bold text-forest mb-8 flex items-center gap-3">
              <Users className="w-7 h-7 text-wine" />
              Our Approach
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personalized Coaching */}
              <div className="border-l-4 border-wine bg-white/40 rounded-r-2xl p-5 sm:p-6 hover:shadow-float hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-wine/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-wine" />
                  </div>
                  <h3 className="text-lg font-subheader font-semibold text-forest">Personalized Coaching</h3>
                </div>
                <p className="text-forest/80 leading-relaxed text-sm mb-3">
                  Every woman&apos;s journey is unique. We never use cookie-cutter programs or one-size-fits-all solutions.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-forest/70">
                    <CheckCircle2 className="w-4 h-4 text-wine/60 flex-shrink-0 mt-0.5" />
                    <span>Fitness plans tailored to your level and goals</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-forest/70">
                    <CheckCircle2 className="w-4 h-4 text-wine/60 flex-shrink-0 mt-0.5" />
                    <span>Nutrition guidance for Indian dietary preferences</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-forest/70">
                    <CheckCircle2 className="w-4 h-4 text-wine/60 flex-shrink-0 mt-0.5" />
                    <span>Mindset coaching for lasting confidence</span>
                  </li>
                </ul>
              </div>

              {/* Community Support */}
              <div className="border-l-4 border-gold bg-white/40 rounded-r-2xl p-5 sm:p-6 hover:shadow-float hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-gold-dark" />
                  </div>
                  <h3 className="text-lg font-subheader font-semibold text-forest">Community Support</h3>
                </div>
                <p className="text-forest/80 leading-relaxed text-sm mb-3">
                  Transformation is not meant to be a solitary journey. Our community keeps you motivated and accountable.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-forest/70">
                    <CheckCircle2 className="w-4 h-4 text-gold-dark/60 flex-shrink-0 mt-0.5" />
                    <span>Vibrant WhatsApp communities</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-forest/70">
                    <CheckCircle2 className="w-4 h-4 text-gold-dark/60 flex-shrink-0 mt-0.5" />
                    <span>Live group training sessions</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-forest/70">
                    <CheckCircle2 className="w-4 h-4 text-gold-dark/60 flex-shrink-0 mt-0.5" />
                    <span>Coach-led check-ins and celebrations</span>
                  </li>
                </ul>
              </div>

              {/* Holistic Wellness */}
              <div className="border-l-4 border-wine bg-white/40 rounded-r-2xl p-5 sm:p-6 hover:shadow-float hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-wine/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-wine" />
                  </div>
                  <h3 className="text-lg font-subheader font-semibold text-forest">Holistic Wellness</h3>
                </div>
                <p className="text-forest/80 leading-relaxed text-sm mb-3">
                  A comprehensive approach addressing all aspects of your wellbeing, not just physical fitness.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-forest/70">
                    <CheckCircle2 className="w-4 h-4 text-wine/60 flex-shrink-0 mt-0.5" />
                    <span>Fitness training and nutritional guidance</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-forest/70">
                    <CheckCircle2 className="w-4 h-4 text-wine/60 flex-shrink-0 mt-0.5" />
                    <span>Sleep optimization and stress management</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-forest/70">
                    <CheckCircle2 className="w-4 h-4 text-wine/60 flex-shrink-0 mt-0.5" />
                    <span>Confidence building practices</span>
                  </li>
                </ul>
              </div>

              {/* Technology-Enabled */}
              <div className="border-l-4 border-gold bg-white/40 rounded-r-2xl p-5 sm:p-6 hover:shadow-float hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-gold-dark" />
                  </div>
                  <h3 className="text-lg font-subheader font-semibold text-forest">Technology-Enabled</h3>
                </div>
                <p className="text-forest/80 leading-relaxed text-sm mb-3">
                  We leverage technology to make your transformation journey seamless and accessible from anywhere.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-forest/70">
                    <CheckCircle2 className="w-4 h-4 text-gold-dark/60 flex-shrink-0 mt-0.5" />
                    <span>Mobile app for on-the-go workouts</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-forest/70">
                    <CheckCircle2 className="w-4 h-4 text-gold-dark/60 flex-shrink-0 mt-0.5" />
                    <span>Live Zoom coaching sessions</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-forest/70">
                    <CheckCircle2 className="w-4 h-4 text-gold-dark/60 flex-shrink-0 mt-0.5" />
                    <span>Recorded class library and digital resources</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* What Makes Us Different - Numbered Feature Cards */}
          <div className="glass-card rounded-[2rem] shadow-medium p-6 sm:p-10 lg:p-12 mb-8">
            <h2 className="text-2xl font-headline font-bold text-forest mb-8 flex items-center gap-3">
              <Award className="w-7 h-7 text-gold-dark" />
              What Makes Us Different
            </h2>

            <div className="space-y-6">
              {/* Cultural Relevance */}
              <div className="border-t-4 border-gold bg-gradient-to-br from-white/60 to-beige-light/30 rounded-2xl p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-headline font-bold text-gold-dark text-sm">01</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-subheader font-semibold text-forest mb-2">Cultural Relevance</h3>
                    <p className="text-forest/80 leading-relaxed text-sm">
                      We understand Indian women because we are Indian women. Our programs incorporate Bollywood dance, traditional movements, and Indian cuisine-friendly nutrition plans. We recognize the unique challenges of balancing family, career, and personal wellness.
                    </p>
                  </div>
                </div>
              </div>

              {/* Expert Team */}
              <div className="border-t-4 border-gold bg-gradient-to-br from-white/60 to-beige-light/30 rounded-2xl p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-headline font-bold text-gold-dark text-sm">02</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-subheader font-semibold text-forest mb-2">Expert Team</h3>
                    <p className="text-forest/80 leading-relaxed text-sm">
                      Certified fitness coaches specializing in women&apos;s health, nutrition specialists who understand Indian dietary patterns, and mindset coaches dedicated to building confidence. Every team member is selected for their expertise and genuine passion for empowering women.
                    </p>
                  </div>
                </div>
              </div>

              {/* Proven Results */}
              <div className="border-t-4 border-gold bg-gradient-to-br from-white/60 to-beige-light/30 rounded-2xl p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-headline font-bold text-gold-dark text-sm">03</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-subheader font-semibold text-forest mb-2">Proven Results</h3>
                    <p className="text-forest/80 leading-relaxed text-sm">
                      Hundreds of women have achieved remarkable transformations &mdash; not just in their bodies but in their entire lives. Increased energy, improved confidence, sustainable weight management, and the inspiration to pursue goals they once thought impossible.
                    </p>
                  </div>
                </div>
              </div>

              {/* Premium Experience */}
              <div className="border-t-4 border-gold bg-gradient-to-br from-white/60 to-beige-light/30 rounded-2xl p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-headline font-bold text-gold-dark text-sm">04</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-subheader font-semibold text-forest mb-2">Premium Experience</h3>
                    <p className="text-forest/80 leading-relaxed text-sm">
                      From your first interaction to your transformation celebration, every touchpoint reflects your worth. High-quality content, responsive coaching, beautifully designed materials, and an elevated brand experience that matches your aspirations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Programs */}
          <div className="glass-card rounded-[2rem] shadow-medium p-6 sm:p-10 lg:p-12 mb-8">
            <h2 className="text-2xl font-headline font-bold text-forest mb-6">Our Programs</h2>
            <div className="space-y-4 text-forest/80 leading-relaxed">
              <p>
                We offer a range of transformation programs designed to meet you wherever you are in your wellness journey. Our signature programs combine intensive fitness coaching, comprehensive nutrition guidance, mindset transformation work, and community support, typically spanning thirty to ninety days with ongoing support options.
              </p>
              <p>
                For those seeking continuous growth and accountability, The Inner Circle provides an exclusive membership experience with advanced coaching, priority access to new programs, and an elevated community of driven women.
              </p>
              <p>
                The Confidence Club offers a supportive community environment where women at all fitness levels can access group classes, nutritional resources, and motivational content in an encouraging, non-intimidating setting.
              </p>
              <p>
                Each program is crafted to deliver maximum value while respecting your time, energy, and commitment to transformation.
              </p>
            </div>
          </div>

          {/* Our Commitment */}
          <div className="glass-card rounded-[2rem] shadow-medium p-6 sm:p-10 lg:p-12 mb-8">
            <h2 className="text-2xl font-headline font-bold text-forest mb-6">Our Commitment to You</h2>
            <p className="text-forest/80 leading-relaxed mb-4">
              When you join The DMK, you become part of a family committed to your success. We promise to deliver:
            </p>
            <ul className="space-y-3 text-forest/80">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" />
                <span>Expert coaching based on evidence and experience</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" />
                <span>Honest guidance that prioritizes your health and wellbeing over quick fixes</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" />
                <span>Unwavering support throughout your transformation journey</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" />
                <span>A judgment-free environment where you can be vulnerable and authentic</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" />
                <span>Celebration of your progress, no matter how small it may seem</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" />
                <span>Continuous improvement of our programs based on your feedback and evolving needs</span>
              </li>
            </ul>
            <p className="text-forest/80 leading-relaxed mt-4">
              We are not just here to help you transform your body. We are here to help you transform your life.
            </p>
          </div>

          {/* Company Information */}
          <div className="glass-card rounded-[2rem] shadow-medium p-6 sm:p-10 lg:p-12 mb-8">
            <h2 className="text-2xl font-headline font-bold text-forest mb-6">Company Information</h2>
            <div className="bg-beige-light/50 rounded-[2rem] p-5 text-sm text-forest/70 border border-forest/10">
              <p className="font-semibold text-forest text-base mb-3">THEDMK (OPC) Private Limited</p>
              <p><strong>Registered Office:</strong> Flat No. 102, Plot No. 57, Laxmi Nivas, Road No. 1, Jyothi Colony, Near AOC, Secunderabad, Hyderabad, Telangana, India - 500015</p>
              <p className="mt-2"><strong>Corporate Identity Number:</strong> U74999TG2021OPC156774</p>
              <p><strong>PAN:</strong> AAICT9878J</p>
              <p><strong>Incorporation Date:</strong> November 9, 2021</p>
            </div>
          </div>

          {/* CTA - Dark Forest Treatment */}
          <div className="rounded-[2rem] shadow-float p-6 sm:p-10 lg:p-12 text-center bg-forest text-ivory relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-ivory mb-4">
                Ready to Begin Your Transformation?
              </h2>
              <p className="text-ivory/70 leading-relaxed mb-8 max-w-xl mx-auto">
                Explore our programs and discover which path is right for you. Your transformation journey begins with a single decision.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-light text-forest px-8 py-3.5 rounded-full font-bold hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all hover:-translate-y-0.5"
                >
                  Explore Programs
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white/10 text-ivory px-8 py-3.5 rounded-full font-semibold hover:bg-white/20 transition-all border border-white/20 hover:-translate-y-0.5"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

        </article>

        <Footer variant="minimal" className="mt-8" />
      </main>
    </div>
  );
}
