"use client"

import {
  DEFAULT_CONTACTS,
  MSG_REVENDA,
  MSG_DISTRIBUIDOR,
  MSG_EVENTOS,
  type ContactsConfig,
} from "./config"

// ----------------- URL builder -----------------

/**
 * Normalize a Brazilian phone input ("(31) 99999-9999", "31999999999",
 * "5531999999999") into the digits-only international form that wa.me wants.
 */
export function normalizeWhatsApp(raw: string): string {
  const digits = (raw ?? "").replace(/\D/g, "")
  if (!digits) return ""
  if (digits.length === 10 || digits.length === 11) return "55" + digits
  return digits
}

/** Build a wa.me URL, or empty string if the phone is missing. */
export function whatsappUrl(phone: string, message = ""): string {
  const num = normalizeWhatsApp(phone)
  if (!num) return ""
  const qs = message ? `?text=${encodeURIComponent(message)}` : ""
  return `https://wa.me/${num}${qs}`
}

/**
 * Sanitize a user-provided custom link. Accepts http(s) URLs only (covers wa.me,
 * api.whatsapp.com, chat.whatsapp.com, and vanity short links). Empty/invalid → "".
 */
export function normalizeCustomLink(raw: string): string {
  const s = (raw ?? "").trim()
  if (!s) return ""
  if (/^https?:\/\//i.test(s)) return s
  return ""
}

/** Resolve category URL: custom link wins if set, otherwise number-derived wa.me. */
export function resolveChannelUrl(customLink: string, phone: string, message = ""): string {
  const custom = normalizeCustomLink(customLink)
  if (custom) return custom
  return whatsappUrl(phone, message)
}

// ----------------- hook -----------------

export interface UseContactsApi {
  config: ContactsConfig
  /** Always false — no async fetch in static export. */
  loading: boolean
  /** Resolved URLs per category — already includes the default message. */
  urls: {
    revenda: string
    distribuidor: string
    eventos: string
  }
  hasAnyConfigured: boolean
}

/**
 * Returns static contact config for the static export build.
 *
 * Phone numbers / custom links are read from NEXT_PUBLIC_* env vars at build
 * time. Set them in .env.local (or the hosting platform's env config) before
 * running `next build`.
 *
 * Example .env.local:
 *   NEXT_PUBLIC_WA_REVENDA=5531999999999
 *   NEXT_PUBLIC_WA_DISTRIBUIDOR=5531988888888
 *   NEXT_PUBLIC_WA_EVENTOS=5531977777777
 */
export function useContacts(): UseContactsApi {
  const config: ContactsConfig = {
    whatsappRevenda:     process.env.NEXT_PUBLIC_WA_REVENDA     ?? DEFAULT_CONTACTS.whatsappRevenda,
    whatsappDistribuidor: process.env.NEXT_PUBLIC_WA_DISTRIBUIDOR ?? DEFAULT_CONTACTS.whatsappDistribuidor,
    whatsappEventos:     process.env.NEXT_PUBLIC_WA_EVENTOS     ?? DEFAULT_CONTACTS.whatsappEventos,
    linkRevenda:         process.env.NEXT_PUBLIC_LINK_REVENDA   ?? DEFAULT_CONTACTS.linkRevenda,
    linkDistribuidor:    process.env.NEXT_PUBLIC_LINK_DISTRIBUIDOR ?? DEFAULT_CONTACTS.linkDistribuidor,
    linkEventos:         process.env.NEXT_PUBLIC_LINK_EVENTOS   ?? DEFAULT_CONTACTS.linkEventos,
  }

  const urls = {
    revenda:      resolveChannelUrl(config.linkRevenda,      config.whatsappRevenda,      MSG_REVENDA),
    distribuidor: resolveChannelUrl(config.linkDistribuidor, config.whatsappDistribuidor, MSG_DISTRIBUIDOR),
    eventos:      resolveChannelUrl(config.linkEventos,      config.whatsappEventos,      MSG_EVENTOS),
  }

  const hasAnyConfigured = Boolean(urls.revenda || urls.distribuidor || urls.eventos)

  return { config, loading: false, urls, hasAnyConfigured }
}
