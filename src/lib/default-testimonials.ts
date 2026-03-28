import type { TestimonialRecord } from "@/lib/testimonials-store";

const DEFAULT_CREATED_AT = "2025-01-01T00:00:00.000Z";

export const DEFAULT_TESTIMONIALS: TestimonialRecord[] = [
  {
    id: "default-mitali-sharma",
    name: "Mitali Sharma, Delhi",
    program: "MBBS Student & Youtuber, 23",
    text: "I went from inconsistent and unmotivated to unstoppable in 90 days. Disha taught me that discipline is the real luxury.",
    profileImageUrl: "/images/misc/Photo of Woman in Confident Pose.png",
    videoUrl: "",
    pinned: false,
    createdAt: DEFAULT_CREATED_AT,
    updatedAt: DEFAULT_CREATED_AT,
  },
  {
    id: "default-aurvi-mishra",
    name: "Aurvi Mishra, Pune",
    program: "Purchase Executive, 25",
    text: "Finally, I feel confident in my body AND my life. This isn't just fitness, it's complete transformation.",
    profileImageUrl: "/images/misc/Aurvi Before & After (empowered energy).png",
    videoUrl: "",
    pinned: false,
    createdAt: DEFAULT_CREATED_AT,
    updatedAt: DEFAULT_CREATED_AT,
  },
  {
    id: "default-dhreeti-vithlani",
    name: "Dhreeti Vithlani, London",
    program: "Actress, 24",
    text: "The structure I needed without the pressure I dreaded. I show up for myself now, not from guilt, from love.",
    profileImageUrl: "/images/misc/Photo of woman, radiant smile.jpg",
    videoUrl: "",
    pinned: false,
    createdAt: DEFAULT_CREATED_AT,
    updatedAt: DEFAULT_CREATED_AT,
  },
];

