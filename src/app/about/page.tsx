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

          {/* Our Approach */}
          <div className="glass-card rounded-[2rem] shadow-medium p-6 sm:p-10 lg:p-12 mb-8">
            <h2 className="text-2xl font-headline font-bold text-forest mb-6 flex items-center gap-3">
              <Users className="w-7 h-7 text-wine" />
              Our Approach
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Personalized Coaching</h3>
                <p className="text-forest/80 leading-relaxed">
                  We understand that every woman&apos;s journey is unique. That is why we never use cookie-cutter programs or one-size-fits-all solutions. When you join The DMK, you receive a personalized fitness plan tailored to your current fitness level, health conditions, and specific goals. Your nutrition guidance considers your dietary preferences, cultural food choices, and lifestyle while teaching you sustainable habits. Our mindset coaching addresses your specific challenges, limiting beliefs, and personal circumstances to help you build lasting confidence.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Community Support</h3>
                <p className="text-forest/80 leading-relaxed">
                  Transformation is not meant to be a solitary journey. Our programs include access to vibrant WhatsApp communities where you connect with like-minded women, live group training sessions that bring energy and accountability, coach-led check-ins and support throughout your journey, and celebration of wins, both big and small, in a judgment-free environment.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Holistic Wellness</h3>
                <p className="text-forest/80 leading-relaxed">
                  We take a comprehensive approach to your wellbeing that addresses all aspects of health. Our programs integrate fitness training that strengthens your body and improves overall health, nutritional guidance that nourishes you from the inside out, sleep optimization strategies for better recovery and energy, stress management techniques to support mental wellness, and confidence building practices that transform how you show up in all areas of life.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Technology-Enabled</h3>
                <p className="text-forest/80 leading-relaxed">
                  We leverage technology to make your transformation journey seamless and accessible. You gain access to our mobile application for on-the-go workout access and progress tracking, live Zoom sessions that bring our coaching directly to you wherever you are, recorded class libraries for flexibility in your schedule, and digital resources including meal plans, workout guides, and educational content.
                </p>
              </div>
            </div>
          </div>

          {/* What Makes Us Different */}
          <div className="glass-card rounded-[2rem] shadow-medium p-6 sm:p-10 lg:p-12 mb-8">
            <h2 className="text-2xl font-headline font-bold text-forest mb-6 flex items-center gap-3">
              <Award className="w-7 h-7 text-gold-dark" />
              What Makes Us Different
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Cultural Relevance</h3>
                <p className="text-forest/80 leading-relaxed">
                  We understand Indian women because we are Indian women. Our programs incorporate Bollywood dance, traditional movements, and culturally relevant fitness activities. Our nutrition plans celebrate Indian cuisine and work within Indian dietary patterns and preferences. We recognize the unique challenges faced by Indian women balancing family, career, and personal wellness.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Expert Team</h3>
                <p className="text-forest/80 leading-relaxed">
                  Our team comprises certified fitness coaches with specialized training in women&apos;s health, nutrition specialists who understand Indian dietary patterns, mindset coaches dedicated to building confidence and resilience, and support staff committed to making your experience exceptional. Every team member is carefully selected not just for their expertise but for their genuine passion for empowering women.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Proven Results</h3>
                <p className="text-forest/80 leading-relaxed">
                  We have helped hundreds of women achieve remarkable transformations, not just in their bodies but in their entire lives. Our clients report increased energy and vitality, improved confidence in personal and professional settings, sustainable weight management without restrictive dieting, better relationships with food and exercise, enhanced mental clarity and emotional balance, and the inspiration to pursue goals they once thought impossible.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Premium Experience</h3>
                <p className="text-forest/80 leading-relaxed">
                  From your first interaction with us to your transformation celebration, we deliver a premium experience that reflects your worth and investment. Our programs feature high-quality content and resources designed with attention to detail, responsive coaching and support that makes you feel valued and heard, beautifully designed materials that inspire and motivate, and an elevated brand experience that matches your aspirations.
                </p>
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
            <div className="bg-cream/50 rounded-xl p-5 text-sm text-forest/70 border border-forest/10">
              <p className="font-semibold text-forest text-base mb-3">THEDMK (OPC) Private Limited</p>
              <p><strong>Registered Office:</strong> Flat No. 102, Plot No. 57, Laxmi Nivas, Road No. 1, Jyothi Colony, Near AOC, Secunderabad, Hyderabad, Telangana, India - 500015</p>
              <p className="mt-2"><strong>Corporate Identity Number:</strong> U74999TG2021OPC156774</p>
              <p><strong>PAN:</strong> AAICT9878J</p>
              <p><strong>Incorporation Date:</strong> November 9, 2021</p>
            </div>
          </div>

          {/* CTA */}
          <div className="glass-card rounded-[2rem] shadow-medium p-6 sm:p-10 lg:p-12 text-center">
            <h2 className="text-2xl font-headline font-bold text-forest mb-4">
              Ready to Begin Your Transformation?
            </h2>
            <p className="text-forest/80 leading-relaxed mb-6 max-w-xl mx-auto">
              Explore our programs and discover which path is right for you. Your transformation journey may begin with a single decision. We are here to support you every step of the way.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 bg-wine text-white px-8 py-3 rounded-full font-semibold hover:bg-wine-light transition-all shadow-md hover:-translate-y-0.5"
              >
                Explore Programs
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/50 text-forest px-8 py-3 rounded-full font-semibold hover:bg-white transition-all shadow-md hover:-translate-y-0.5 border border-forest/20"
              >
                Contact Us
              </Link>
            </div>
          </div>

        </article>

        <Footer variant="minimal" className="mt-8" />
      </main>
    </div>
  );
}
