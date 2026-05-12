"use client"

import { useState } from "react"
import {
  ArrowRight,
  Check,
  MapPin,
  Phone,
  User,
  MessageCircle,
} from "lucide-react"
import { EMPTY_REQUEST } from "@/lib/wishlist/config"
import type { UF } from "@/lib/types/pdv"
import { cn } from "@/lib/utils"

/**
 * City-request form — static export version.
 *
 * In the original implementation this submitted to a Supabase-backed Server
 * Action. With `output: 'export'` there is no server runtime, so on submit we
 * build a WhatsApp deep-link that pre-fills the user's data into a message to
 * the commercial team. The team receives the request via WhatsApp and can
 * manually track demand by city.
 *
 * To configure the destination number set NEXT_PUBLIC_WA_REVENDA in .env.local:
 *   NEXT_PUBLIC_WA_REVENDA=5531999999999
 */

interface WishlistFormProps {
  /** Focus + soft-highlight trigger. Set true when user's search had zero PDVs. */
  highlighted?: boolean
  /** Prefill fields when we know the CEP/cidade from a ViaCEP lookup. */
  prefill?: {
    cep?: string
    cidade?: string
    uf?: UF | ""
  } | null
}

function formatCep(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

function formatWhatsapp(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11)
  if (!d) return ""
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function WishlistForm({ highlighted, prefill }: WishlistFormProps) {
  const [form, setForm] = useState({ ...EMPTY_REQUEST })
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Apply prefill
  if (prefill) {
    if (prefill.cep && !form.cep) {
      setForm((f) => ({ ...f, cep: formatCep(prefill.cep ?? "") }))
    }
    if (prefill.cidade && !form.cidade) {
      setForm((f) => ({ ...f, cidade: prefill.cidade ?? "" }))
    }
    if (prefill.uf && !form.uf) {
      setForm((f) => ({ ...f, uf: (prefill.uf ?? "") as UF | "" }))
    }
  }

  const cepDigits = form.cep.replace(/\D/g, "")
  const canSubmit =
    form.nome.trim().length >= 2 &&
    form.whatsapp.replace(/\D/g, "").length >= 10 &&
    cepDigits.length === 8

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    const waNumber = (process.env.NEXT_PUBLIC_WA_REVENDA ?? "").replace(/\D/g, "")

    const cidade = form.cidade
      ? ` — ${form.cidade}${form.uf ? `/${form.uf}` : ""}`
      : form.cep ? ` — CEP ${form.cep}` : ""

    const text = [
      `Olá! Quero Bang Bang na minha cidade${cidade}.`,
      `Nome: ${form.nome}`,
      `WhatsApp: ${form.whatsapp}`,
      form.cep ? `CEP: ${form.cep}` : "",
    ]
      .filter(Boolean)
      .join("\n")

    if (waNumber) {
      window.open(
        `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer",
      )
    }

    setSubmitted(true)
    setForm({ ...EMPTY_REQUEST })
  }

  // ----------------- Success state -----------------
  if (submitted) {
    return (
      <section id="quero-bang-bang" aria-labelledby="quero-bang-bang-title" className="scroll-mt-24">
        <div className="rounded-3xl p-8 md:p-12 bg-white border border-[#4A2C1A]/10 shadow-[0_20px_60px_-30px_rgba(45,24,16,0.18)]">
          <div className="flex flex-col items-center text-center gap-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#E87A1E] text-white flex items-center justify-center shadow-[0_10px_24px_-8px_rgba(232,122,30,0.5)]">
              <Check size={32} strokeWidth={2.5} />
            </div>
            <h3
              id="quero-bang-bang-title"
              className="font-black uppercase text-[#1A1A1A] text-2xl md:text-3xl leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-heading-var)", fontWeight: 700 }}
            >
              Recebido! Obrigado.
            </h3>
            <p className="text-[#4A2C1A]/80 leading-relaxed">
              Sua mensagem foi aberta no WhatsApp. O time comercial vai te avisar quando Bang Bang chegar na sua cidade.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-2 text-sm font-bold uppercase tracking-wider text-[#E87A1E] hover:text-[#C4650F] underline underline-offset-4"
            >
              Indicar outra cidade
            </button>
          </div>
        </div>
      </section>
    )
  }

  // ----------------- Form -----------------
  return (
    <section
      id="quero-bang-bang"
      aria-labelledby="quero-bang-bang-title"
      className={cn(
        "scroll-mt-24 rounded-3xl bg-white overflow-hidden transition-all",
        highlighted
          ? "border-2 border-[#E87A1E] shadow-[0_20px_60px_-20px_rgba(232,122,30,0.35)] ring-1 ring-[#E87A1E]/20"
          : "border border-[#4A2C1A]/10 shadow-[0_12px_40px_-20px_rgba(45,24,16,0.12)]",
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] items-stretch">
        {/* Left — pitch column */}
        <div
          className="relative flex flex-col gap-4 p-6 md:p-9 lg:border-r border-[#4A2C1A]/8"
          style={{
            background:
              "radial-gradient(circle at 0% 0%, rgba(255,211,106,0.18), transparent 55%)," +
              "linear-gradient(180deg, #FFFDF7 0%, #FAFAF8 100%)",
          }}
        >
          <span className="inline-flex self-start items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E87A1E] text-white text-[10px] font-black uppercase tracking-[0.22em] shadow-[0_6px_14px_-6px_rgba(232,122,30,0.6)]">
            <MapPin size={12} strokeWidth={2.6} />
            Ajuda a mapear
          </span>

          <h3
            id="quero-bang-bang-title"
            className="font-black uppercase text-[#1A1A1A] text-3xl md:text-4xl leading-[1.05] tracking-tight"
            style={{ fontFamily: "var(--font-heading-var)", fontWeight: 700 }}
          >
            Quero Bang Bang
            <br />
            <span className="text-[#E87A1E]">na minha cidade</span>.
          </h3>

          <p className="text-[#4A2C1A]/75 leading-relaxed text-[15px]">
            Joga teu CEP — quando abrir PDV aí, a gente te avisa.
          </p>

          {highlighted && (
            <div className="rounded-xl bg-[#E87A1E]/10 border border-[#E87A1E]/30 text-[#C4650F] px-3.5 py-2.5 text-sm font-semibold leading-snug">
              Sua busca não achou PDV. Deixa teus dados que a gente te avisa quando chegar.
            </div>
          )}

          {!mobileExpanded && (
            <button
              type="button"
              onClick={() => setMobileExpanded(true)}
              aria-expanded={false}
              aria-controls="wishlist-form-panel"
              className={cn(
                "lg:hidden mt-2 inline-flex w-full items-center justify-center gap-2 h-14 px-6 rounded-xl",
                "bg-[#E87A1E] text-white font-black text-[13px] uppercase tracking-[0.16em]",
                "shadow-[0_16px_40px_-10px_rgba(232,122,30,0.55)]",
                "hover:bg-[#C4650F] active:translate-y-0 transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E87A1E] focus-visible:ring-offset-2",
              )}
            >
              Quero Bang Bang na minha cidade
              <ArrowRight size={16} strokeWidth={2.6} />
            </button>
          )}
        </div>

        {/* Right — form */}
        <form
          id="wishlist-form-panel"
          onSubmit={handleSubmit}
          className={cn(
            "flex-col gap-4 p-6 md:p-9 bg-[#FAFAF8]",
            mobileExpanded ? "flex" : "hidden lg:flex",
          )}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#4A2C1A]/55">
              Cadastro · &lt;30s
            </span>
          </div>

          <Field id="wl-nome" label="Seu nome" icon={<User size={13} strokeWidth={2.4} />}>
            <input
              id="wl-nome"
              name="nome"
              type="text"
              autoComplete="name"
              required
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              placeholder="Como prefere ser chamado"
              className={inputCls}
            />
          </Field>

          <Field
            id="wl-wpp"
            label="WhatsApp"
            icon={<Phone size={13} strokeWidth={2.4} />}
            hint="DDD + número"
          >
            <input
              id="wl-wpp"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={form.whatsapp}
              onChange={(e) =>
                setForm((f) => ({ ...f, whatsapp: formatWhatsapp(e.target.value) }))
              }
              placeholder="(31) 99999-9999"
              className={inputCls}
            />
          </Field>

          <Field
            id="wl-cep"
            label="CEP"
            icon={<MapPin size={13} strokeWidth={2.4} />}
            hint="8 dígitos pra geolocalização"
          >
            <input
              id="wl-cep"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              required
              value={form.cep}
              onChange={(e) => setForm((f) => ({ ...f, cep: formatCep(e.target.value) }))}
              placeholder="00000-000"
              className={inputCls}
            />
          </Field>

          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "mt-3 inline-flex items-center justify-center gap-2 h-11 rounded-lg text-[12px] font-black uppercase tracking-[0.18em] transition-all",
              "bg-[#E87A1E] text-white shadow-[0_10px_24px_-10px_rgba(232,122,30,0.55)]",
              "hover:bg-[#C4650F] hover:-translate-y-0.5 active:translate-y-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E87A1E] focus-visible:ring-offset-2",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none",
            )}
          >
            <MessageCircle size={14} strokeWidth={2.6} />
            Quero Bang Bang aqui
          </button>

          <p className="text-[11px] text-[#4A2C1A]/50 text-center">
            A gente só usa pra te avisar quando abrir PDV na sua região.
          </p>
        </form>
      </div>
    </section>
  )
}

// ----------------- small helpers -----------------

const inputCls =
  "w-full h-11 px-3.5 rounded-xl border border-[#4A2C1A]/15 bg-white text-[#2D1810] text-sm placeholder:text-[#4A2C1A]/40 focus:border-[#E87A1E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87A1E]/40 transition-colors"

function Field({
  id,
  label,
  icon,
  hint,
  hintTone,
  children,
}: {
  id: string
  label: string
  icon?: React.ReactNode
  hint?: string | null
  hintTone?: "error"
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label
        htmlFor={id}
        className="text-[10px] font-black tracking-[0.22em] uppercase text-[#4A2C1A]/60 flex items-center gap-1.5"
      >
        {icon && <span className="text-[#E87A1E]">{icon}</span>}
        {label}
      </label>
      {children}
      {hint && (
        <p
          className={cn(
            "text-[11px]",
            hintTone === "error"
              ? "text-[#D32F2F] font-semibold"
              : "text-[#4A2C1A]/50",
          )}
        >
          {hint}
        </p>
      )}
    </div>
  )
}
