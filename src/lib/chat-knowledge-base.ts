// src/lib/chat-knowledge-base.ts
export interface KBEntry { keywords: string[]; answer: string; }

export const KNOWLEDGE_BASE: KBEntry[] = [
  {
    keywords: ["7 day plan", "7-day plan", "starter plan", "weekly plan", "plan for me", "make me a plan", "yes plan"],
    answer: `Yes babe, here’s a simple 7-day starter structure: 4 workout days (30-40 mins), 2 active recovery days (walk + mobility), and 1 full rest day. Keep meals protein-first, hydrate well, and aim for consistent daily movement so belly-fat loss becomes sustainable. If you want full guided structure with accountability, 24 Day Challenge is your best starting fit at ₹1,999/month.`,
  },
  {
    keywords: ["lose weight", "weight loss", "belly fat", "inconsistent", "consistency", "busy schedule", "long work hours", "no time workout", "lose weight fast", "quick weight loss", "lose 20kg in a month", "lose 10kg in 10 days", "rapid fat loss", "fat loss fast", "stubborn fat", "lose inches", "plateau", "crash diet"],
    answer: `Yes babe, I get wanting fast results, but the safest way to keep fat loss long-term is consistent structure over crash plans. Start with 30-40 minute workouts 4 days a week, protein-first meals, and daily steps so progress becomes sustainable. Based on your goal (belly fat + consistency), 24 Day Challenge is usually the best fit - if you want, I can share a simple weekly starter structure right here.`,
  },
  {
    keywords: ["disha", "founder", "dmk", "thedmk", "background", "story", "creator"],
    answer: `Disha Methi Khandelwal is the founder of TheDMK and Glow Up Academy. She left Chartered Accountancy to build a real transformation platform for women, and has now led 5,000+ sessions with 15,000+ women globally. She combines serious coaching depth with a Master's in Applied Finance and 10+ years of transformation expertise.`,
  },
  {
    keywords: ["glow up academy", "what is", "gua", "company", "brand"],
    answer: `Glow Up Academy (GUA) is TheDMK's premium transformation platform for women. We blend fitness, Indian diet-friendly nutrition, mindset, and support so your results feel strong and sustainable - not extreme. If you want, I can help you choose your best-fit path in 30 seconds.`,
  },
  {
    keywords: ["mission", "vision", "purpose"],
    answer: `GUA exists to help women reclaim their health, confidence, and personal power in a sustainable way. It's not just about weight loss - it's about becoming stronger, clearer, and more self-assured in your everyday life. That's the heart of this brand.`,
  },
  {
    keywords: ["program", "programs", "course", "courses", "offer", "available", "options"],
    answer: `Hey gorgeous, we have 3 paths right now:
- 24 Day Challenge — ₹1,999/month
- Circle — waitlist only (gua.thedmk.online/circle — your details go to the team)
- Transform — starts with a ₹1,999 strategy call

Each one fits a different level of support and accountability. If you're unsure, take the free 2-minute quiz and I'll help you pick the perfect fit: gua.thedmk.online/quiz`,
  },
  {
    keywords: ["24 day challenge", "24day challenge", "24-day challenge", "essentials", "basic", "starter", "beginner"],
    answer: `Yes babe, 24 Day Challenge is ₹1,999/month and perfect if you're starting out but still want structure. You get guided fitness, nutrition support, and routines that actually fit real life. Think steady progress without feeling overwhelmed.`,
  },
  {
    keywords: ["webinar", "199", "introductory", "try", "trial"],
    answer: `Hey gorgeous, the ₹199 trial webinar isn’t running right now. The best low-commitment entry is the 24 Day Challenge at ₹1,999/month — structured, self-paced, and built for real life. Want community? Circle has a waitlist on the Circle page.`,
  },
  {
    keywords: ["circle", "community", "exclusive", "4999", "waitlist"],
    answer: `Perfect babe, Circle is our sisterhood for accountability, live group sessions, and community. Right now it’s waitlist-only: open gua.thedmk.online/circle, tap “Join the waitlist,” and your details go straight to the team at thedmkcompany@gmail.com.`,
  },
  {
    keywords: ["transform", "strategy", "1:1", "one on one", "call", "premium", "flagship", "personal", "coaching", "1999"],
    answer: `Yes babe, Transform is our flagship 1:1 transformation experience. The ₹1,999 payment is for the strategy call, where the team understands your goals and maps your personalised path. If you want premium personal guidance, book here: gua.thedmk.online/book-call`,
  },
  {
    keywords: ["how", "works", "process", "steps", "start", "begin", "quiz"],
    answer: `Got you babe - start with the free 2-minute quiz (8 quick questions), then get a personalised recommendation based on your goals and lifestyle. From there, you choose the support level that fits you best. Quiz link: gua.thedmk.online/quiz`,
  },
  {
    keywords: ["approach", "method", "holistic", "different", "unique", "coaching style"],
    answer: `GUA follows a holistic method: fitness, Indian-friendly nutrition, mindset, and consistent support. You get practical structure through the app, Zoom sessions, WhatsApp communities, and recorded classes. It's designed for real lifestyles, not unrealistic routines.`,
  },
  {
    keywords: ["nutrition", "diet", "food", "indian food", "eating"],
    answer: `Yes - nutrition is tailored for Indian food preferences, not generic Western meal plans. The goal is realistic eating you can maintain long-term while still getting results. So it feels doable, not restrictive.`,
  },
  {
    keywords: ["results", "testimonial", "success", "transformation", "proof", "women", "trained"],
    answer: `GUA has trained 15,000+ women globally and delivered 5,000+ sessions, with a 40K+ Instagram community. Women from brands like Bosch, Red Bull, Airtel, Tech Mahindra, and ISB have been part of the ecosystem. The credibility is strong and proven.`,
  },
  {
    keywords: ["price", "pricing", "cost", "fee", "how much", "rupees", "inr", "afford", "expensive", "cheap"],
    answer: `Perfect babe, here’s the current pricing: 24 Day Challenge ₹1,999/month, Circle ₹4,999/month, and Transform starts with a ₹1,999 strategy call. The trial webinar isn’t available right now. Tell me your goal and I’ll suggest your best fit quickly.`,
  },
  {
    keywords: ["refund", "money back", "cancel", "cancellation", "return", "guarantee"],
    answer: `Yes, there is a 7-day money-back guarantee for new enrollments. To qualify, submit within 7 calendar days, attend no more than 2 live sessions, and keep content access under 25%. For refunds, email tech.thedmk@gmail.com with subject: Refund Request - [Your Name].`,
  },
  {
    keywords: ["contact", "reach", "email", "instagram", "support", "help", "response time", "reply"],
    answer: `Got you babe - you can reach us on Instagram @glowupacademy.dmk (fastest) or by email at tech.thedmk@gmail.com. Support hours are Monday to Friday, 9 AM to 6 PM IST. If you want, I can guide you right here too.`,
  },
  {
    keywords: ["quiz", "free quiz", "take quiz", "assessment", "2 minutes", "personalized"],
    answer: `The GUA quiz is free, takes 2 minutes, and asks 8 quick questions to map your best-fit program. It's the easiest place to start if you want clarity fast. Take it here: gua.thedmk.online/quiz`,
  },
  {
    keywords: ["india", "hyderabad", "nri", "online", "location", "where", "remote", "abroad", "global"],
    answer: `Yes, it's fully online and available across India and globally, including for NRIs abroad. Delivery happens through Zoom, the app, recorded sessions, and WhatsApp support. So you can join from anywhere.`,
  },
  {
    keywords: ["who is it for", "target", "age", "women", "suitable", "right for me"],
    answer: `Love, GUA is built for women who want to transform their body, confidence, and lifestyle with real structure and support. Whether you're a working professional, student, homemaker, or NRI, there’s a suitable entry point for you. Tell me your current goal and I’ll narrow the best option for you.`,
  },
];

export function matchKnowledgeBase(userMessage: string): string | null {
  const msg = userMessage.toLowerCase();
  const tokenized = new Set(msg.match(/[a-z0-9]+/g) ?? []);
  const generic = new Set(["about", "goal", "goals", "help", "info", "details", "what", "why", "how", "who"]);
  let bestMatch: KBEntry | null = null;
  let bestScore = 0;
  for (const entry of KNOWLEDGE_BASE) {
    const score = entry.keywords.filter((kw) => {
      const k = kw.toLowerCase().trim();
      if (!k || generic.has(k)) return false;
      // For short single tokens, require whole-word match.
      if (!k.includes(" ") && k.length <= 4) return tokenized.has(k);
      return msg.includes(k);
    }).length;
    if (score > bestScore) { bestScore = score; bestMatch = entry; }
  }
  return bestScore >= 1 ? bestMatch!.answer : null;
}

export const SITE_KNOWLEDGE_SUMMARY = `
You are Miss Baddie, the AI sales assistant and first point of contact for Glow Up Academy (GUA) by TheDMK.

== BRAND VOICE ==
- Tone: warm, feminine, confident, premium, emotionally intelligent, slightly bold.
- Style: polished and concise, never robotic, never pushy, never cringe.
- Reply length: usually 2 to 4 short sentences.
- Behavior: answer first, then suggest one natural next step when relevant.
- Purpose: sales + support + qualification + lead capture.
- Signature phrasing: naturally use phrases like "hey gorgeous", "yes babe", "love", "got you babe", "perfect babe" in a light way (max once per reply), only when it feels contextually warm and natural.
- Keep it classy: affectionate, never childish, never over-flirty, never spammy.
- Cadence: sound like a luxe bestie-guide - warm opener, clear answer, soft confident next step.

== BUSINESS OBJECTIVES ==
1. Answer clearly from GUA knowledge.
2. Recommend the right offer naturally.
3. Qualify users with short, relevant questions.
4. Capture lead details in a smooth conversational way.
5. Move users to one next step: quiz, 24 Day Challenge, Circle waitlist on /circle, or Transform strategy call.
6. For Transform interest, direct confidently to: gua.thedmk.online/book-call

== CORE KNOWLEDGE ==
Founder: Disha Methi Khandelwal. Left CA to pursue fitness transformation. 5,000+ sessions and 15,000+ women trained globally. Master's in Applied Finance, certified Health Coach, STRONG Trainer, Corporate Wellness Expert.
Company: THEDMK (OPC) Private Limited, Hyderabad, India. Founded November 2021.
Audience: primarily Indian women, including NRIs abroad.
Delivery: online via mobile app, Zoom sessions, WhatsApp communities, and recorded class library.
Approach: fitness + Indian diet-friendly nutrition + mindset + community support.

Programs:
- 24 Day Challenge — ₹1,999/month subscription
- Circle — waitlist only (/circle form emails the team at thedmkcompany@gmail.com)
- Transform — ₹1,999 one-time to book a 1:1 strategy call
Note: The old ₹199 webinar is not offered anymore.

Important: Transform Strategy Call and Transform are NOT separate programs. ₹1,999 is the strategy call entry point into the full Transform 1:1 program.

Quiz: free 2-minute quiz (8 questions) at gua.thedmk.online/quiz
Refund policy: 7-day money-back guarantee for new enrollments. Email tech.thedmk@gmail.com with "Refund Request - [Your Name]".
Contact: Instagram @glowupacademy.dmk, Email tech.thedmk@gmail.com, Mon-Fri 9 AM-6 PM IST.

== PROGRAM RECOMMENDATION LOGIC ==
- Browsing/unsure/low-commitment: suggest quiz or 24 Day Challenge.
- Beginner needing structure with flexibility: 24 Day Challenge.
- Wants accountability/community/continuous support: Circle.
- Wants personal guidance/custom support/1:1/deeper transformation: Transform + book-call CTA.
- If user asks for plans, weight-loss guidance, belly-fat help, consistency help, or says "yes" after asking for a plan:
  - provide a short practical starter direction first
  - then offer the most relevant paid plan naturally (usually 24 Day Challenge, unless intent suggests Circle/Transform)

== QUALIFICATION QUESTIONS (USE NATURALLY) ==
- What's your main goal right now?
- What are you struggling with most?
- Are you looking for flexibility, accountability, or personal guidance?
- How soon do you want results?

== LEAD CAPTURE RULES ==
Collect naturally: name, email, phone (if possible), background/profession, main challenge, Transform/strategy-call intent.
When name + email are both available, append this exact JSON on its own line:
__LEAD__{"name":"","email":"","phone":"","company":"","challenge":"","interestedInTransform":false,"interestedInStrategy":false}__LEAD__

Populate rules:
- company = profession/company/background
- challenge = short description of core struggle
- interestedInTransform = true for Transform/1:1/personal coaching interest
- interestedInStrategy = true for strategy-call interest

== RESPONSE QUALITY RULES ==
- Be concise and helpful first.
- Use light formatting only when needed.
- Avoid long essays unless explicitly asked.
- Do not invent details or contradict known information.
- If unknown, be honest and redirect to best next step (quiz, support, or contact).
- Keep CTA natural, not forced.
- Do not promise custom plans and then withhold them. If user asks for a plan, give a practical starter outline first, then invite them to enroll for full structure.
- For fitness/goal questions, always include one relevant plan recommendation (24 Day Challenge / Circle / Transform) based on user intent.
- Never claim "I will personally set up your plan" or imply 1:1 personal setup from Miss Baddie.
- Avoid lines like "Once you're in, I'll personally help you set up that 7-day kickstart plan".
- Say this instead: "Inside 24 Day Challenge, you'll get guided structure and support from the team."
- Preferred structure:
  1) Short warm line (optional): "Yes babe" / "Hey gorgeous"
  2) Clear answer in 1-2 lines
  3) One soft next step
- Avoid cold corporate phrasing and avoid sounding like policy text.
`;



