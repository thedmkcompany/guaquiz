import Link from "next/link";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";

export const metadata = {
  title: "Refund Policy | The DMK",
  description: "Learn about our refund policy, including the 7-day money-back guarantee and eligibility criteria.",
};

export default function RefundPolicyPage() {
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
                Refund Policy
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
                  At THEDMK (OPC) Private Limited, we are committed to delivering high-quality fitness and wellness transformation programs. We understand that circumstances may arise requiring you to reconsider your enrollment. This Refund Policy outlines the terms and conditions under which refunds may be requested and processed.
                </p>
                <div className="bg-cream/50 rounded-xl p-4 text-sm text-forest/70 border border-forest/10">
                  <p className="font-semibold text-forest mb-2">Registered Office:</p>
                  <p>THEDMK (OPC) Private Limited</p>
                  <p>Flat No. 102, Plot No. 57, Laxmi Nivas, Road No. 1, Jyothi Colony, Near AOC,</p>
                  <p>Secunderabad, Hyderabad, Telangana, India - 500015</p>
                  <p className="mt-2"><strong>CIN:</strong> U74999TG2021OPC156774</p>
                  <p><strong>PAN:</strong> AAICT9878J</p>
                </div>
                <p className="text-forest/80 leading-relaxed mt-4">
                  This Refund Policy should be read in conjunction with our Terms and Conditions and Privacy Policy. By enrolling in our programs, you acknowledge and agree to this Refund Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">General Refund Terms</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We offer limited refunds based on the timing of your cancellation request and the extent of your participation in the program. Refunds are processed to the original payment method used during enrollment. Processing time for approved refunds is typically seven to fourteen business days from the date of approval, though this may vary depending on your financial institution.
                </p>
                <p className="text-forest/80 leading-relaxed">
                  All refund requests must be submitted in writing through email to hello@thedmk.in or through our designated customer support channels. Verbal requests or messages in WhatsApp groups will not be considered valid cancellation requests.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Refund Eligibility Criteria</h2>

                <div className="bg-gold/10 border border-gold/30 rounded-xl p-5 mb-6">
                  <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Seven-Day Money-Back Guarantee</h3>
                  <p className="text-forest/80 leading-relaxed mb-4">
                    We offer a seven-day money-back guarantee for new enrollments in our transformation programs. If you are not satisfied with your program within the first seven days of enrollment, you may request a full refund, subject to the following conditions.
                  </p>
                  <p className="text-forest/80 leading-relaxed mb-4">
                    To qualify for the seven-day refund, you must submit your refund request in writing within seven calendar days from your enrollment date. You must not have participated in more than two live sessions or accessed more than twenty-five percent of the program content. You must provide a brief explanation of your reason for requesting a refund.
                  </p>
                  <p className="text-forest/80 leading-relaxed">
                    If these conditions are met, we will process a full refund, minus any applicable payment processing fees charged by our payment gateway. This typically amounts to approximately two to three percent of the transaction value.
                  </p>
                </div>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Refunds After Seven Days</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Refund eligibility after the seven-day period varies based on program duration and your level of participation. We evaluate such requests on a case-by-case basis, considering factors such as the amount of content accessed, sessions attended, coaching time received, and program duration remaining.
                </p>
                <p className="text-forest/80 leading-relaxed mb-4">
                  For programs of thirty days or less, refunds are generally not available after the seven-day period has elapsed, as the majority of the program value is delivered within this timeframe.
                </p>
                <p className="text-forest/80 leading-relaxed mb-6">
                  For programs longer than thirty days, partial refunds may be considered if requested within the first twenty-five percent of the program duration and if participation has been minimal. Such refunds would be prorated based on unused program time, minus the value of services already received.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Medical and Emergency Circumstances</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We recognize that unexpected medical situations or personal emergencies may prevent you from continuing with your program. If you are unable to participate due to serious illness, injury, medical condition requiring immediate treatment, hospitalization, or unforeseen personal emergencies, you may request consideration for a refund or program credit.
                </p>
                <p className="text-forest/80 leading-relaxed">
                  Such requests require supporting documentation, which may include a medical certificate from a licensed physician, hospital admission records, or other relevant documentation as appropriate to the circumstance. We will review these requests compassionately and may offer options including a prorated refund, program credit for future use, or the ability to pause and resume your program when able.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Non-Refundable Situations</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Refunds will not be granted under the following circumstances:
                </p>
                <ul className="list-disc list-inside text-forest/80 space-y-2 mb-4">
                  <li>If you have accessed more than twenty-five percent of program content or attended more than twenty-five percent of scheduled sessions, the program is considered substantially utilized and is non-refundable, except in approved medical or emergency cases.</li>
                  <li>If your access was suspended or terminated due to violation of our Terms and Conditions, including inappropriate behavior toward coaches or participants, sharing proprietary program content, or other policy violations.</li>
                  <li>Based on dissatisfaction with results if you did not actively participate in the program, follow the provided guidelines, attend sessions regularly, or engage with your assigned coach as recommended.</li>
                  <li>Once you have received and used any physical products, materials, or supplements that were included as part of your program package, that portion of your enrollment fee is non-refundable.</li>
                  <li>For programs purchased at promotional or discounted rates, special conditions may apply, and such programs may have more restrictive refund policies. These conditions will be clearly communicated at the time of purchase.</li>
                  <li>If you have previously received a refund for any of our programs, you may not be eligible for future refunds and will be evaluated on a case-by-case basis.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Processing Refund Requests</h2>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">How to Request a Refund</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  To request a refund, please send an email to hello@thedmk.in with the subject line &quot;Refund Request - [Your Full Name]&quot; and include your full name as registered, email address used during enrollment, program name and enrollment date, reason for requesting a refund, and any supporting documentation if applicable.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Review Process</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Upon receiving your refund request, we will acknowledge receipt within two business days and review your request within five to seven business days. We may contact you for additional information or clarification during the review process.
                </p>
                <p className="text-forest/80 leading-relaxed mb-6">
                  Our team will evaluate your request based on this Refund Policy, your enrollment details, participation level, and any special circumstances presented. You will be notified of our decision via email, including the refund amount if approved or the reason if denied.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Approved Refunds</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  If your refund request is approved, we will process the refund to your original payment method within seven to fourteen business days. The actual credit to your account may take an additional five to ten business days depending on your bank or payment provider.
                </p>
                <p className="text-forest/80 leading-relaxed mb-6">
                  Refund amounts will be calculated based on the applicable terms, minus any payment processing fees, which cannot be recovered. The refund will be issued in Indian Rupees regardless of the original payment currency.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Denied Refunds</h3>
                <p className="text-forest/80 leading-relaxed">
                  If your refund request is denied, we will provide a clear explanation of the reasons based on this policy. You may appeal the decision by providing additional information or documentation within seven days of receiving the denial notice. Appeals will be reviewed by senior management, and the decision on appeal will be final.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Program Credits and Transfers</h2>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Program Credits</h3>
                <p className="text-forest/80 leading-relaxed mb-4">
                  In certain situations where a full refund may not be appropriate but we recognize genuine circumstances preventing completion, we may offer program credits as an alternative. These credits can be applied toward future enrollments in any of our programs within twelve months from the date of issuance.
                </p>
                <p className="text-forest/80 leading-relaxed mb-6">
                  Program credits are non-transferable and cannot be exchanged for cash. The value of program credits may be adjusted to reflect current program pricing at the time of redemption.
                </p>

                <h3 className="text-lg font-subheader font-semibold text-forest mb-3">Program Transfers</h3>
                <p className="text-forest/80 leading-relaxed">
                  If you are unable to complete your program due to scheduling conflicts or other non-emergency circumstances, you may request to transfer to a future program cohort. Transfer requests must be submitted at least seven days before your desired transfer date. Program transfers are subject to availability and may only be granted once per enrollment. Additional fees may apply if transferring to a program with a higher enrollment value.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Payment Plan Cancellations</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  If you enrolled in a program with an installment payment plan and wish to cancel, different terms apply. For cancellations within the seven-day money-back guarantee period, any paid installments will be refunded according to the standard seven-day policy, and future installments will be canceled.
                </p>
                <p className="text-forest/80 leading-relaxed">
                  For cancellations after seven days, you remain responsible for paying any remaining installments for services already rendered or content already accessed. We will calculate the prorated program value based on your participation, and you must pay any outstanding balance before cancellation is finalized. Future installments for unused portions may be canceled if applicable.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Chargebacks and Disputes</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  If you initiate a chargeback or payment dispute with your bank or credit card company without first attempting to resolve the matter with us directly, we reserve the right to suspend your access to all our services immediately and pursue collection of any amounts owed.
                </p>
                <p className="text-forest/80 leading-relaxed">
                  Chargebacks may result in your permanent ban from future enrollment in any of our programs. We encourage you to contact us first to resolve any payment concerns, as we are committed to fair and reasonable solutions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Refunds for Technical Issues</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  If you experience technical difficulties preventing access to our services, please contact our support team immediately at hello@thedmk.in. We will work diligently to resolve technical issues within forty-eight hours.
                </p>
                <p className="text-forest/80 leading-relaxed mb-4">
                  If we are unable to resolve technical issues that prevent your participation within a reasonable timeframe, we may offer a prorated refund, program extension, or program credit at our discretion.
                </p>
                <p className="text-forest/80 leading-relaxed">
                  Technical issues caused by your equipment, internet connection, or failure to meet minimum system requirements do not qualify for refunds.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Modifications to Refund Policy</h2>
                <p className="text-forest/80 leading-relaxed">
                  We reserve the right to modify this Refund Policy at any time. Changes will be posted on our website with an updated &quot;Last Updated&quot; date. However, any changes to this policy will not affect refund requests for programs enrolled prior to the modification date. Those requests will be governed by the policy in effect at the time of enrollment.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Questions and Support</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We are committed to addressing your concerns and finding fair solutions. If you have questions about this Refund Policy or need assistance with a refund request, please contact us:
                </p>
                <div className="bg-cream/50 rounded-xl p-4 text-sm text-forest/70 border border-forest/10">
                  <p><strong>Email:</strong> hello@thedmk.in</p>
                  <p className="mt-2"><strong>Mailing Address:</strong></p>
                  <p>THEDMK (OPC) Private Limited</p>
                  <p>Flat No. 102, Plot No. 57, Laxmi Nivas, Road No. 1, Jyothi Colony, Near AOC,</p>
                  <p>Secunderabad, Hyderabad, Telangana, India - 500015</p>
                </div>
                <p className="text-forest/80 leading-relaxed mt-4">
                  Our customer support team is available Monday through Friday, nine AM to six PM IST, and will respond to your inquiry within two business days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-headline font-bold text-forest mb-4">Final Notes</h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  This Refund Policy is designed to be fair to both our clients and our business while maintaining the quality and integrity of our transformation programs. We invest significant resources in delivering personalized coaching, developing content, and supporting your journey, and our refund policy reflects this commitment.
                </p>
                <p className="text-forest/80 leading-relaxed">
                  We encourage all prospective clients to carefully review our program details, read testimonials, and reach out with any questions before enrolling to ensure our programs align with your goals and expectations. Thank you for choosing THEDMK for your fitness and wellness transformation journey. We are committed to your success and satisfaction.
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
