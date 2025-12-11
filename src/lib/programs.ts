import { Program } from "@/types";

// Define your 4 programs here
// Update the wixProductId with actual product IDs from your Wix Store
export const programs: Program[] = [
  {
    id: "program-1",
    slug: "program-1",
    name: "Program 1",
    description: "Description for Program 1. Update this with your actual program details.",
    price: 4999,
    currency: "INR",
    features: [
      "Feature 1",
      "Feature 2",
      "Feature 3",
      "Feature 4",
    ],
    wixProductId: "", // Add your Wix product ID
  },
  {
    id: "program-2",
    slug: "program-2",
    name: "Program 2",
    description: "Description for Program 2. Update this with your actual program details.",
    price: 7999,
    currency: "INR",
    features: [
      "Feature 1",
      "Feature 2",
      "Feature 3",
      "Feature 4",
    ],
    wixProductId: "", // Add your Wix product ID
  },
  {
    id: "program-3",
    slug: "program-3",
    name: "Program 3",
    description: "Description for Program 3. Update this with your actual program details.",
    price: 12999,
    currency: "INR",
    features: [
      "Feature 1",
      "Feature 2",
      "Feature 3",
      "Feature 4",
    ],
    wixProductId: "", // Add your Wix product ID
  },
  {
    id: "program-4",
    slug: "program-4",
    name: "Program 4",
    description: "Description for Program 4. Update this with your actual program details.",
    price: 19999,
    currency: "INR",
    features: [
      "Feature 1",
      "Feature 2",
      "Feature 3",
      "Feature 4",
    ],
    wixProductId: "", // Add your Wix product ID
  },
];

export function getProgramById(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
