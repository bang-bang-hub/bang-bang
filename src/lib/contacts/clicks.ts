/**
 * Client-side CTA click tracking — no-op stub for static export.
 *
 * The original implementation posted to /api/clicks (Supabase). That route
 * has been removed as part of the static-export refactor. This stub keeps the
 * public API surface identical so all call-sites (Header, Footer, CTASection,
 * RevendaSection, HeroSection) continue to compile without modification.
 */

export type CTACategory = "revenda" | "distribuidor" | "eventos"

/** No-op. Replace with your analytics provider when ready. */
export function trackClick(_category: CTACategory): void {
  // intentionally empty — static export has no server to receive events
}
