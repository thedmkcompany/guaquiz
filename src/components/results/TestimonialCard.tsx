/**
 * Re-exports unified TestimonialCard for backwards compatibility
 * @see src/components/ui/testimonial-card.tsx for implementation
 */
export { TestimonialCard, type TestimonialData } from "@/components/ui/testimonial-card";

// Re-export for existing imports that use Testimonial type
export type { TestimonialData as Testimonial } from "@/components/ui/testimonial-card";
