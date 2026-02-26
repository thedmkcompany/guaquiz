import Link from "next/link";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import { Footer } from "@/components/ui/footer";

export const metadata = {
  title: "Terms and Conditions | The DMK",
  description: "Terms and Conditions governing your use of THEDMK (OPC) Private Limited fitness and wellness services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-pastel font-body text-forest">
      {/* Main Content */}
      <main className="pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <DecorativeBlobs />

        <article className="max-w-4xl mx-auto relative z-10">
          <div className="glass-card rounded-[2rem] shadow-medium p-6 sm:p-10 lg:p-12">
            {/* Header */}
            <header className="mb-10 pb-8 border-b border-forest/10">
              <h1 className="text-3xl sm:text-4xl font-headline font-bold text-forest mb-4">
                Terms and Conditions
              </h1>
              <p className="text-forest/60 font-body">
                <strong>Last Updated:</strong> December 13, 2025
              </p>
            </header>

            {/* Content */}
            <div className="prose prose-forest max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Agreement to Terms</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  These Terms and Conditions constitute a legally binding agreement between you and THEDMK (OPC) Private Limited (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) governing your access to and use of our fitness and wellness services, including all programs offered under the brands &quot;The DMK,&quot; &quot;The Inner Circle,&quot; and &quot;The Confidence Club.&quot;
                </p>
                <div className="bg-beige-light/50 rounded-xl p-4 text-sm text-forest/70 border border-forest/10">
                  <p className="font-semibold text-forest mb-2">Registered Office:</p>
                  <p>THEDMK (OPC) Private Limited</p>
                  <p>Flat No. 102, Plot No. 57, Laxmi Nivas, Road No. 1, Jyothi Colony, Near AOC,</p>
                  <p>Secunderabad, Hyderabad, Telangana, India - 500015</p>
                  <p className="mt-2"><strong>CIN:</strong> U74999TG2021OPC156774</p>
                  <p><strong>PAN:</strong> AAICT9878J</p>
                  <p><strong>GST:</strong> Under Process</p>
                </div>
                <p className="text-forest/80 leading-relaxed mt-4">
                  By registering for, accessing, or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with these terms, you must not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Eligibility and Registration</h2>
                <p className="text-forest/80 leading-relaxed">
                  To participate in our programs, you must be at least eighteen years of age and have the legal capacity to enter into binding contracts under Indian law. You must reside in a jurisdiction where our services are legally available and provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access to or use of your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Services Description</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We offer premium fitness and wellness transformation programs that combine personalized fitness coaching, customized nutrition guidance, mindset and confidence building support, live group training sessions via Zoom, access to recorded workout classes, community support through WhatsApp groups, mobile application access, and progress tracking tools and resources.
                </p>
                <p className="text-forest/80 leading-relaxed">
                  The specific services, duration, and deliverables vary by program and are detailed in your enrollment confirmation. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time, with reasonable notice where practicable.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Health and Medical Disclaimers</h2>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Consultation with Healthcare Providers</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Our programs are designed for generally healthy individuals seeking fitness and wellness guidance. Before beginning any fitness or nutrition program, you must consult with your physician or other qualified healthcare provider, particularly if you have any pre-existing medical conditions, are pregnant or nursing, are taking any medications, have a history of eating disorders, have experienced any recent injuries, or have any concerns about your ability to exercise.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Not Medical Advice</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  The information, coaching, and guidance provided through our services are for educational and motivational purposes only and do not constitute medical, nutritional, or therapeutic advice. We are fitness and wellness coaches, not licensed medical professionals, dietitians, or therapists. Our recommendations should not replace professional medical advice, diagnosis, or treatment.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Assumption of Risk</h3>
                <p className="text-forest/80 leading-relaxed">
                  You acknowledge and accept that participation in fitness activities carries inherent risks, including risk of physical injury, aggravation of pre-existing conditions, or in extreme cases, death. You voluntarily assume all such risks and agree to participate at your own risk. You are responsible for monitoring your own physical condition during workouts and stopping immediately if you experience any pain, discomfort, dizziness, or other concerning symptoms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Program Enrollment and Payments</h2>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Enrollment Process</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Enrollment in our programs requires completion of the registration process, submission of required health and fitness information, acceptance of these Terms and Conditions, and payment of applicable fees.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Pricing and Fees</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Program fees are specified during the enrollment process and may vary based on the program selected, duration, and any applicable promotions. All prices are listed in Indian Rupees unless otherwise stated. We reserve the right to modify our pricing at any time, but changes will not affect existing enrollments.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Payment Terms</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Payment must be made in full at the time of enrollment unless installment options are specifically offered. We accept payments through our designated payment processors. You authorize us to charge your chosen payment method for all fees associated with your enrollment. If payment fails or is declined, we reserve the right to suspend your access until payment is successfully processed.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Taxes</h3>
                <p className="text-forest/80 leading-relaxed">
                  All fees are exclusive of applicable taxes, including Goods and Services Tax. You are responsible for all taxes associated with your purchase, and we will collect and remit taxes as required by law.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Program Participation Requirements</h2>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Active Engagement</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  To benefit fully from our programs, you commit to attend scheduled live sessions where applicable, follow the provided fitness and nutrition guidelines, engage with your assigned coach, participate in community activities, submit progress updates as requested, and complete assigned tasks and workouts.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Respectful Conduct</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  You agree to treat all coaches, staff, and fellow participants with respect and professionalism. Harassment, bullying, discrimination, or abusive behavior of any kind will not be tolerated and may result in immediate termination of your enrollment without refund.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Prohibited Activities</h3>
                <p className="text-forest/80 leading-relaxed">
                  You must not share your account credentials with others, record, distribute, or share program content without authorization, use our services for any illegal or unauthorized purpose, attempt to gain unauthorized access to our systems, interfere with or disrupt our services or servers, or engage in any activity that violates these terms or applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Intellectual Property Rights</h2>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Our Content</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  All content provided through our services, including workout videos, nutrition plans, educational materials, coaching methodologies, mobile applications, branding and design elements, and instructional content, is owned by THEDMK (OPC) Private Limited or our licensors and is protected by Indian and international copyright, trademark, and other intellectual property laws.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Limited License</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We grant you a limited, non-exclusive, non-transferable, revocable license to access and use our content solely for your personal, non-commercial participation in our programs. You may not copy, modify, distribute, sell, or lease any part of our services or content, reverse engineer or attempt to extract source code, remove any copyright or proprietary notices, or use our content for any commercial purpose.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Your Content</h3>
                <p className="text-forest/80 leading-relaxed">
                  When you submit content to us, including progress photos, testimonials, feedback, or communications, you grant us a worldwide, royalty-free, perpetual license to use, reproduce, modify, and display such content for purposes of providing our services, marketing and promotional activities, improving our programs, and creating aggregated data and insights. You represent and warrant that you own or have the necessary rights to any content you submit and that such content does not violate any third-party rights or applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Confidentiality and Privacy</h2>
                <p className="text-forest/80 leading-relaxed">
                  We collect and process your personal information in accordance with our Privacy Policy, which is incorporated into these Terms by reference. You acknowledge that participation in our programs may involve sharing personal health and fitness information. We implement reasonable security measures to protect your information but cannot guarantee absolute security. You agree to keep confidential any proprietary information, coaching methodologies, or materials shared during the program.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Photography, Video, and Testimonials</h2>
                <p className="text-forest/80 leading-relaxed">
                  We may photograph or record live sessions, create promotional materials, and showcase client transformations. By participating in our programs, you consent to being photographed or recorded during group sessions. However, we will obtain your explicit written consent before using your individual transformation photos, videos, or testimonials in any marketing or promotional materials. You may withdraw this consent at any time by contacting us in writing.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Cancellation and Refunds</h2>
                <p className="text-forest/80 leading-relaxed">
                  Our cancellation and refund policies are detailed in our separate <Link href="/refund" className="text-wine hover:text-wine-light font-medium">Refund Policy</Link> document. Please review the Refund Policy carefully before enrolling, as it forms part of these Terms and Conditions. Generally, we offer limited refunds within specified timeframes, and certain conditions apply. Refunds are processed according to the terms outlined in the Refund Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Term and Termination</h2>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Program Duration</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Your enrollment continues for the duration specified in your program package. Some programs may auto-renew unless you cancel according to the procedures outlined in your enrollment confirmation.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Termination by You</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  You may cancel your enrollment in accordance with our Refund Policy. To cancel, you must provide written notice through the methods specified in the Refund Policy.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Termination by Us</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We reserve the right to suspend or terminate your access to our services immediately, without refund, if you violate these Terms and Conditions, engage in prohibited activities, provide false or misleading information, fail to make required payments, or engage in conduct that we determine is harmful to our business, staff, or other participants.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Effects of Termination</h3>
                <p className="text-forest/80 leading-relaxed">
                  Upon termination, your right to access our services will immediately cease. We may delete your account and data in accordance with our Privacy Policy and data retention practices. Provisions of these Terms that by their nature should survive termination will remain in effect, including intellectual property rights, disclaimers, limitations of liability, and dispute resolution provisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Disclaimers and Limitations of Liability</h2>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Disclaimer of Warranties</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Our services are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, either express or implied. We disclaim all warranties, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that our services will be uninterrupted, error-free, or secure, that defects will be corrected, or that our services or servers are free of viruses or harmful components. We make no guarantees regarding specific fitness or health outcomes.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Limitation of Liability</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  To the maximum extent permitted by Indian law, THEDMK (OPC) Private Limited and its directors, officers, employees, coaches, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or related to your use of our services, even if we have been advised of the possibility of such damages.
                </p>
                <p className="text-forest/80 leading-relaxed">
                  Our total liability to you for all claims arising from or related to our services shall not exceed the amount you paid to us in the twelve months preceding the claim. Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability for incidental or consequential damages, so some of the above limitations may not apply to you.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Indemnification</h2>
                <p className="text-forest/80 leading-relaxed">
                  You agree to indemnify, defend, and hold harmless THEDMK (OPC) Private Limited and its directors, officers, employees, coaches, agents, and affiliates from and against any claims, liabilities, damages, losses, costs, or expenses, including reasonable attorneys&apos; fees, arising out of or related to your use of our services, violation of these Terms and Conditions, infringement of any intellectual property or other rights, or any harm caused to third parties through your use of our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Governing Law and Dispute Resolution</h2>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Governing Law</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Jurisdiction</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Any disputes arising out of or relating to these Terms or our services shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Dispute Resolution Process</h3>
                <p className="text-forest/80 leading-relaxed">
                  Before initiating any legal proceedings, you agree to attempt to resolve disputes through good faith negotiations by contacting us in writing with a detailed description of the dispute. If the dispute cannot be resolved through negotiation within thirty days, either party may pursue resolution through the appropriate courts in Hyderabad, Telangana.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Modifications to Terms</h2>
                <p className="text-forest/80 leading-relaxed">
                  We reserve the right to modify these Terms and Conditions at any time. We will provide notice of material changes by posting the updated terms on our website and indicating the &quot;Last Updated&quot; date, sending notification through our services or via email, or providing notice during your next login or session. Your continued use of our services after changes become effective constitutes your acceptance of the modified terms. If you do not agree with the changes, you must discontinue use of our services and may cancel your enrollment in accordance with our Refund Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">General Provisions</h2>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Entire Agreement</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  These Terms and Conditions, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and THEDMK (OPC) Private Limited regarding your use of our services and supersede all prior agreements and understandings.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Severability</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Waiver</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Assignment</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  You may not assign or transfer your rights or obligations under these Terms without our prior written consent. We may assign or transfer our rights and obligations without restriction.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Force Majeure</h3>
                <p className="text-forest/80 leading-relaxed">
                  We shall not be liable for any failure or delay in performing our obligations due to circumstances beyond our reasonable control, including acts of God, natural disasters, pandemics, government actions, war, terrorism, civil unrest, labor disputes, or technical failures.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Contact Information</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  For questions about these Terms and Conditions, please contact us:
                </p>
                <div className="bg-beige-light/50 rounded-xl p-4 text-sm text-forest/70 border border-forest/10">
                  <p><strong>Email:</strong> hello@thedmk.online</p>
                  <p className="mt-2"><strong>Mailing Address:</strong></p>
                  <p>THEDMK (OPC) Private Limited</p>
                  <p>Flat No. 102, Plot No. 57, Laxmi Nivas, Road No. 1, Jyothi Colony, Near AOC,</p>
                  <p>Secunderabad, Hyderabad, Telangana, India - 500015</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Acknowledgment</h2>
                <p className="text-forest/80 leading-relaxed">
                  By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. You also acknowledge that you have reviewed our Privacy Policy and Refund Policy and agree to their terms.
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
