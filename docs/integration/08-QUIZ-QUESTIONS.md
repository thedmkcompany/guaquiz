## 🎯 THE DMK QUIZ - QUESTIONS & SCORING LOGIC

### **THE 8 QUIZ QUESTIONS (DMK Voice)**

---

**QUESTION 1: Current Era**

**"How would you describe your current era?"**

- A) Survival mode—I'm getting by, but not thriving
- B) Inconsistent—I start strong but can't stay consistent  
- C) Ready to go all in—discipline is my next luxury

---

**QUESTION 2: Definition of Hot & Unstoppable**

**"What does becoming hot and unstoppable mean to you?"**

- A) Feeling powerful in my body again
- B) Building unshakeable confidence
- C) Creating a sustainable, high-performing lifestyle
- D) All of the above—I want the complete transformation

---

**QUESTION 3: How Do You Rise?** (PRIMARY ROUTING QUESTION)

**"How do you rise?"**

- A) On my own time—I need flexibility to fit my life
- B) With a community—I thrive with my queens around me
- C) With personal guidance—I want a transformation architect

---

**QUESTION 4: Weekly Investment**

**"How much time are you investing in yourself weekly?"**

- A) 2-3 hours/week
- B) 4-6 hours/week
- C) 7+ hours/week

---

**QUESTION 5: Ideal Experience**

**"What does your ideal transformation experience look like?"**

- A) Structure without pressure—discipline that feels luxurious
- B) Accountability and community—I want my tribe
- C) High-touch personalization—custom everything

---

**QUESTION 6: Past Program Experience**

**"What's your relationship with transformation programs?"**

- A) This is my first real commitment
- B) I've started and stopped—I need something different
- C) I've seen results but hit a ceiling

---

**QUESTION 7: Investment Level** (BUDGET QUALIFIER)

**"What investment level aligns with where you are?"**

- A) Foundation level: ₹2,000-3,000/month
- B) Community level: ₹4,000-6,000/month
- C) Immersive level: ₹10,000+/month
- D) Full transformation: ₹1,00,000+

---

**QUESTION 8: Timeline**

**"The DMK Woman doesn't wait. When does your transformation begin?"**

- A) This week—I'm ready now
- B) Within the month—I need to prepare
- C) I'm still exploring my options

---

## **SCORING ALGORITHM**

```javascript
// Initialize scores for each outcome
let scores = {
  essentials: 0,
  trial: 0,
  circle: 0,
  transform: 0
};

// QUESTION 1: Current Era
switch(q1) {
  case 'A': // Survival mode
    scores.essentials += 10;
    break;
  case 'B': // Inconsistent
    scores.trial += 10;
    break;
  case 'C': // Ready to go all in
    scores.circle += 10;
    scores.transform += 5;
    break;
}

// QUESTION 2: Hot & Unstoppable Definition
switch(q2) {
  case 'A': // Body only
    scores.essentials += 5;
    break;
  case 'B': // Confidence
    scores.circle += 5;
    break;
  case 'C': // Lifestyle
    scores.circle += 5;
    break;
  case 'D': // All of the above
    scores.circle += 10;
    scores.transform += 10;
    break;
}

// QUESTION 3: How Do You Rise? (PRIMARY ROUTING)
switch(q3) {
  case 'A': // Own time/flexibility
    scores.essentials += 25; // Strong signal
    break;
  case 'B': // Community
    scores.circle += 25; // Strong signal
    scores.trial += 10;
    break;
  case 'C': // Personal guidance
    scores.transform += 30; // Very strong signal
    break;
}

// QUESTION 4: Weekly Time
switch(q4) {
  case 'A': // 2-3 hours
    scores.essentials += 5;
    break;
  case 'B': // 4-6 hours
    scores.circle += 5;
    scores.trial += 5;
    break;
  case 'C': // 7+ hours
    scores.transform += 10;
    break;
}

// QUESTION 5: Ideal Experience
switch(q5) {
  case 'A': // Structure without pressure
    scores.circle += 10;
    break;
  case 'B': // Accountability & community
    scores.circle += 15;
    scores.trial += 5;
    break;
  case 'C': // High-touch personalization
    scores.transform += 15;
    break;
}

// QUESTION 6: Past Experience
switch(q6) {
  case 'A': // First commitment
    scores.trial += 15; // Strong signal for trial
    break;
  case 'B': // Started/stopped
    scores.trial += 15; // Strong signal for trial
    break;
  case 'C': // Hit ceiling
    scores.circle += 5;
    scores.transform += 5;
    break;
}

// QUESTION 7: Budget (OVERRIDING FACTOR)
switch(q7) {
  case 'A': // ₹2K-3K (Foundation)
    scores.essentials += 50; // Huge weight
    scores.circle = 0; // Can't afford
    scores.transform = 0; // Can't afford
    scores.trial += 10; // Can still try trial
    break;
  case 'B': // ₹4K-6K (Community)
    scores.circle += 25;
    scores.trial += 15;
    scores.transform = 0; // Can't afford Transform
    break;
  case 'C': // ₹10K+ (Immersive)
    scores.transform += 20;
    scores.circle += 10;
    break;
  case 'D': // ₹1L+ (Full transformation)
    scores.transform += 40; // Very strong signal
    break;
}

// QUESTION 8: Timeline (URGENCY MODIFIER)
switch(q8) {
  case 'A': // This week
    scores.circle += 15;
    scores.transform += 15;
    scores.trial -= 5; // Less likely if urgent
    break;
  case 'B': // Within month
    scores.trial += 5;
    break;
  case 'C': // Exploring
    scores.trial += 10;
    break;
}

// EDGE CASE: If Transform budget but low time commitment, disqualify
if ((q7 === 'C' || q7 === 'D') && q4 === 'A') {
  scores.transform = 0; // Transform needs 7+ hours/week
}

// DETERMINE WINNER
const result = Object.keys(scores).reduce((a, b) => 
  scores[a] > scores[b] ? a : b
);

// TIE-BREAKER (if multiple scores are equal)
// Priority: transform > trial > circle > essentials
function getTieBreaker(scores) {
  const maxScore = Math.max(...Object.values(scores));
  
  if (scores.transform === maxScore) return 'transform';
  if (scores.trial === maxScore) return 'trial';
  if (scores.circle === maxScore) return 'circle';
  return 'essentials';
}

// FINAL RESULT
const recommendation = getTieBreaker(scores);
```

---

## **ROUTING OUTCOMES**

| Recommendation | What they see |
|----------------|---------------|
| `essentials` | Essentials Result Page (₹2,499/month) |
| `trial` | Trial Result Page (₹499 → Circle path) |
| `circle` | Circle Result Page (₹4,499/month direct) |
| `transform` | Transform Result Page (₹1,49,999 → Book call) |

---

## **EXAMPLE SCORING SCENARIOS**

### **Scenario 1: Rhea (High-Intent Professional)**
- Q1: C (Ready all in) → Circle +10, Transform +5
- Q2: D (All of above) → Circle +10, Transform +10
- Q3: B (Community) → Circle +25, Trial +10
- Q4: B (4-6 hours) → Circle +5, Trial +5
- Q5: B (Accountability) → Circle +15, Trial +5
- Q6: C (Hit ceiling) → Circle +5, Transform +5
- Q7: B (₹4K-6K) → Circle +25, Trial +15
- Q8: A (This week) → Circle +15, Transform +15

**Final Scores:**
- Essentials: 0
- Trial: 50
- Circle: **110** ← WINNER
- Transform: 35 (but capped by budget)

**Result: CIRCLE DIRECT**

---

### **Scenario 2: Niharika (NRI, Commitment-Hesitant)**
- Q1: B (Inconsistent) → Trial +10
- Q2: C (Lifestyle) → Circle +5
- Q3: B (Community) → Circle +25, Trial +10
- Q4: B (4-6 hours) → Circle +5, Trial +5
- Q5: B (Accountability) → Circle +15, Trial +5
- Q6: B (Started/stopped) → Trial +15
- Q7: B (₹4K-6K) → Circle +25, Trial +15
- Q8: C (Exploring) → Trial +10

**Final Scores:**
- Essentials: 0
- Trial: **70** ← WINNER
- Circle: 75 (close, but trial edges out due to commitment hesitancy)
- Transform: 0

**Wait, Circle is higher! Let me recalculate...**

Actually Circle = 75, Trial = 70

But looking at her profile (started/stopped, exploring, sporadic motivation), the TIE-BREAKER logic should favor Trial.

**Adjusted logic: If Circle and Trial are within 10 points AND Q6 = "started/stopped" → Choose Trial**

**Result: TRIAL**

---

### **Scenario 3: Budget-Conscious First-Timer**
- Q1: A (Survival mode) → Essentials +10
- Q2: A (Body focus) → Essentials +5
- Q3: A (Own time) → Essentials +25
- Q4: A (2-3 hours) → Essentials +5
- Q5: A (Structure) → Circle +10
- Q6: A (First commitment) → Trial +15
- Q7: A (₹2K-3K) → **Essentials +50, Circle/Transform = 0**
- Q8: B (Within month) → Trial +5

**Final Scores:**
- Essentials: **95** ← WINNER (budget locked them in)
- Trial: 20
- Circle: 0 (budget disqualified)
- Transform: 0 (budget disqualified)

**Result: ESSENTIALS**

---

### **Scenario 4: High-Budget VIP**
- Q1: C (Ready all in) → Circle +10, Transform +5
- Q2: D (All of above) → Circle +10, Transform +10
- Q3: C (Personal guidance) → Transform +30
- Q4: C (7+ hours) → Transform +10
- Q5: C (High-touch) → Transform +15
- Q6: C (Hit ceiling) → Circle +5, Transform +5
- Q7: D (₹1L+) → Transform +40
- Q8: A (This week) → Circle +15, Transform +15

**Final Scores:**
- Essentials: 0
- Trial: 0
- Circle: 40
- Transform: **130** ← WINNER

**Result: TRANSFORM**

---

## **SIMPLIFIED DECISION TREE**

```
Q7 (Budget) = ₹2K-3K?
    YES → ESSENTIALS (budget locks it)
    NO → Continue scoring

Q3 (How Rise) = Personal guidance?
    YES + Q7 = ₹1L+? 
        YES → TRANSFORM (strong signals)
        NO → Continue scoring

Q3 (How Rise) = Own time/flexibility?
    YES → ESSENTIALS (unless budget allows Circle)

Q3 (How Rise) = Community?
    YES → Check commitment:
        Q6 = Started/stopped OR Q8 = Exploring?
            YES → TRIAL (needs sampling)
            NO → CIRCLE DIRECT (ready to commit)

Default if unclear → TRIAL (safest entry point)
```
