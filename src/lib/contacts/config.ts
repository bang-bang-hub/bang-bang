/**
 * Single WhatsApp channel per CTA category. One number = one link, reused
 * across every button in that category (Header, Revenda section, Eventos
 * section, Footer, CTA section cards).
 *
 * Data is fetched from Supabase (contact_channels table, singleton row).
 */

export interface ContactsConfig {
  /** Bares, restaurantes, mercados, conveniências, etc. */
  whatsappRevenda: string
  /** Distribuição regional — comercial / logística / exclusividade. */
  whatsappDistribuidor: string
  /** Produtores de evento, ativação de marca. */
  whatsappEventos: string
  /** Consumidor pedindo Bang Bang na cidade dele (wishlist). */
  whatsappCidade: string
  /** Optional custom WhatsApp link — when set, overrides the number-derived wa.me URL. */
  linkRevenda: string
  linkDistribuidor: string
  linkEventos: string
  linkCidade: string
}

// Numero oficial Bang Bang Brasil — hardcoded como fallback pra eliminar
// dependencia de env var no Azure. NEXT_PUBLIC_WA_* ainda sobrescreve se setado.
const BB_WA = "5531998242682"

export const DEFAULT_CONTACTS: ContactsConfig = {
  whatsappRevenda: BB_WA,
  whatsappDistribuidor: BB_WA,
  whatsappEventos: BB_WA,
  whatsappCidade: BB_WA,
  linkRevenda: "",
  linkDistribuidor: "",
  linkEventos: "",
  linkCidade: "",
}

// Pre-fill messages live in code — staff doesn't need to edit these.
// "Vim pelo site" sinaliza origem para o time comercial filtrar lead.
export const MSG_REVENDA = "Olá! Vim pelo site da Bang Bang e quero revender."
export const MSG_DISTRIBUIDOR = "Olá! Vim pelo site da Bang Bang e quero conversar sobre distribuição."
export const MSG_EVENTOS = "Olá! Vim pelo site da Bang Bang e quero levar pro meu evento."
export const MSG_CIDADE = "Olá! Vim pelo site da Bang Bang e quero Bang Bang na minha cidade. Pode me avisar quando chegar aqui?"
