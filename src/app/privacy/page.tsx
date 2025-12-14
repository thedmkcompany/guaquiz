import Link from "next/link";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";

export const metadata = {
  title: "Privacy Policy | The DMK",
  description: "Learn how THEDMK (OPC) Private Limited collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-pastel font-body text-forest">
      {/* Header */}
      <Header variant="back" position="fixed" />

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <DecorativeBlobs />

        <article className="max-w-4xl mx-auto relative z-10">
          <div className="glass-card rounded-[2rem] shadow-medium p-6 sm:p-10 lg:p-12">
            {/* Header */}
            <header className="mb-10 pb-8 border-b border-forest/10">
              <h1 className="text-3xl sm:text-4xl font-headline font-bold text-forest mb-4">
                Privacy Policy
              </h1>
              <p className="text-forest/60 font-body">
                <strong>Last Updated:</strong> December 13, 2025
              </p>
            </header>

            {/* Content */}
            <div className="prose prose-forest max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Introduction</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  THEDMK (OPC) Private Limited (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates fitness and wellness programs under the brands &quot;The DMK,&quot; &quot;The Inner Circle,&quot; and &quot;The Confidence Club.&quot; We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, including our websites, mobile applications, and transformation programs.
                </p>
                <div className="bg-cream/50 rounded-xl p-4 text-sm text-forest/70 border border-forest/10">
                  <p className="font-semibold text-forest mb-2">Registered Office:</p>
                  <p>THEDMK (OPC) Private Limited</p>
                  <p>Flat No. 102, Plot No. 57, Laxmi Nivas, Road No. 1, Jyothi Colony, Near AOC,</p>
                  <p>Secunderabad, Hyderabad, Telangana, India - 500015</p>
                  <p className="mt-2"><strong>CIN:</strong> U74999TG2021OPC156774</p>
                  <p><strong>PAN:</strong> AAICT9878J</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Information We Collect</h2>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Personal Information You Provide</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  When you register for our programs or services, we collect personal information that you voluntarily provide, including your name, email address, phone number, date of birth, gender, physical measurements, health information, fitness goals, dietary preferences and restrictions, medical conditions relevant to fitness training, payment information, and photographs or videos you share for progress tracking.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Automatically Collected Information</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  When you access our services, we automatically collect certain information about your device and usage patterns, including IP address, browser type and version, device identifiers, operating system, pages visited and time spent on pages, clickstream data, access times and dates, and app usage statistics and performance data.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Health and Fitness Data</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  With your explicit consent, we collect and process sensitive health information necessary for delivering our fitness and wellness programs, including body measurements and composition, weight and progress photos, exercise performance data, nutritional intake information, sleep patterns and recovery data, menstrual cycle information where relevant, and any medical conditions affecting your fitness journey.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Communication Data</h3>
                <p className="text-forest/80 leading-relaxed">
                  We collect information from your interactions with us, including messages exchanged in WhatsApp groups, communications with coaches and support staff, feedback and survey responses, testimonials and reviews, and recordings of live Zoom sessions where applicable.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">How We Use Your Information</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We use the collected information to provide and improve our services, including delivering personalized fitness coaching and nutrition guidance, customizing workout plans and meal recommendations, tracking your progress and transformation journey, facilitating communication between you and your assigned coaches, operating our mobile applications and online platforms, processing payments and managing subscriptions, sending you program updates and educational content, and responding to your inquiries and support requests.
                </p>
                <p className="text-forest/80 leading-relaxed">
                  We also use your information for business operations and improvement, including analyzing usage patterns to enhance our services, conducting research to develop new programs and features, ensuring platform security and preventing fraud, complying with legal obligations and maintaining records, and sending you marketing communications where you have consented.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Legal Basis for Processing (for Indian Users)</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We process your personal information based on your consent for processing health and fitness data, participation in transformation programs, receiving marketing communications, and recording and sharing testimonials.
                </p>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We also process information where necessary for contract performance to deliver services you have purchased, manage your account and subscription, and provide customer support.
                </p>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Additionally, we process data to comply with legal obligations under Indian tax laws and regulations, maintain financial and business records, and respond to legal requests and proceedings.
                </p>
                <p className="text-forest/80 leading-relaxed">
                  Processing is also conducted for legitimate interests including improving our services and user experience, ensuring platform security, conducting business analytics, and communicating service updates.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Data Sharing and Disclosure</h2>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Service Providers</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We share information with third-party service providers who assist in payment processing, hosting and technical infrastructure, email and SMS communications, customer support tools, analytics and performance monitoring, and video conferencing platforms.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Coaches and Team Members</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Your information is shared with assigned coaches and relevant team members to deliver personalized coaching services, provide nutritional guidance, track your progress, offer support and motivation, and ensure continuity of care.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Business Transfers</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  In connection with any merger, sale, acquisition, or transfer of all or part of our business, your information may be transferred to the acquiring entity, subject to this Privacy Policy.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Legal Requirements</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We may disclose your information when required by law, in response to legal process or government requests, to protect our rights and property, to enforce our terms and conditions, in emergencies to protect personal safety, or to investigate potential violations.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">With Your Consent</h3>
                <p className="text-forest/80 leading-relaxed">
                  We may share your information for purposes not described in this policy with your explicit consent, including featuring your transformation story in marketing materials, sharing before-and-after photos publicly, or using your testimonials in promotional content.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Data Security</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information, including encryption of data in transit and at rest, secure authentication mechanisms, regular security assessments, access controls and user permissions, secure backup procedures, and staff training on data protection.
                </p>
                <p className="text-forest/80 leading-relaxed">
                  However, no method of transmission over the internet or electronic storage is completely secure. While we strive to protect your personal information, we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Data Retention</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, including for the duration of your active participation in our programs, for a reasonable period after program completion to provide continued support, as required by applicable tax and accounting regulations, and to resolve disputes and enforce our agreements.
                </p>
                <p className="text-forest/80 leading-relaxed">
                  When your information is no longer needed, we will securely delete or anonymize it in accordance with our data retention procedures.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Your Rights and Choices</h2>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Access and Correction</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  You have the right to access the personal information we hold about you and request corrections if the information is inaccurate or incomplete.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Data Portability</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  You may request a copy of your personal information in a structured, commonly used, and machine-readable format.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Deletion</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  You can request deletion of your personal information, subject to our legal obligations to retain certain records.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Withdrawal of Consent</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Where we process your information based on consent, you may withdraw that consent at any time. This will not affect the lawfulness of processing before withdrawal.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Marketing Communications</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  You can opt out of receiving marketing communications by using the unsubscribe link in emails, adjusting your account preferences, or contacting us directly.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Exercising Your Rights</h3>
                <p className="text-forest/80 leading-relaxed">
                  To exercise any of these rights, please contact us using the contact information provided below. We will respond to your request within thirty days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Children&apos;s Privacy</h2>
                <p className="text-forest/80 leading-relaxed">
                  Our services are intended for individuals aged eighteen years and above. We do not knowingly collect personal information from children under eighteen. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">International Data Transfers</h2>
                <p className="text-forest/80 leading-relaxed">
                  While our primary operations are in India, some of our service providers may be located in other countries. When we transfer your information internationally, we ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Third-Party Links</h2>
                <p className="text-forest/80 leading-relaxed">
                  Our services may contain links to third-party websites, applications, or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Changes to This Privacy Policy</h2>
                <p className="text-forest/80 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by posting the updated policy on our website and indicating the &quot;Last Updated&quot; date. Your continued use of our services after changes become effective constitutes acceptance of the revised policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Contact Us</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-cream/50 rounded-xl p-4 text-sm text-forest/70 border border-forest/10">
                  <p><strong>Email:</strong> hello@thedmk.in</p>
                  <p className="mt-2"><strong>Mailing Address:</strong></p>
                  <p>THEDMK (OPC) Private Limited</p>
                  <p>Flat No. 102, Plot No. 57, Laxmi Nivas, Road No. 1, Jyothi Colony, Near AOC,</p>
                  <p>Secunderabad, Hyderabad, Telangana, India - 500015</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Grievance Officer</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  In accordance with the Information Technology Act, 2000, and rules made thereunder, the contact details of our Grievance Officer are:
                </p>
                <div className="bg-cream/50 rounded-xl p-4 text-sm text-forest/70 border border-forest/10">
                  <p><strong>Email:</strong> grievances@thedmk.in</p>
                  <p><strong>Address:</strong> THEDMK (OPC) Private Limited, Flat No. 102, Plot No. 57, Laxmi Nivas, Road No. 1, Jyothi Colony, Near AOC, Secunderabad, Hyderabad, Telangana, India - 500015</p>
                </div>
                <p className="text-forest/80 leading-relaxed mt-4">
                  The Grievance Officer will respond to your concerns within thirty days of receipt.
                </p>
              </section>
            </div>

          </div>
        </article>

        <Footer variant="minimal" className="mt-8" />
      </main>
    </div>
  );
}
