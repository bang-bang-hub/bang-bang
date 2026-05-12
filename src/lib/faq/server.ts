import { DEFAULT_FAQ, type FAQItem } from "./config"

/**
 * Returns the static FAQ items for the static export build.
 *
 * The original implementation fetched from Supabase (faq_items table) and
 * fell back to DEFAULT_FAQ on error. With static export there is no server
 * runtime, so we always return the hardcoded defaults directly.
 *
 * To update FAQ content: edit DEFAULT_FAQ in ./config.ts and rebuild.
 */
export async function getFaqItems(): Promise<FAQItem[]> {
  return DEFAULT_FAQ
}
