"use client"

import { ArrowRight, MapPin, MessageCircle } from "lucide-react"
import { useContacts } from "@/lib/contacts/useContacts"
import { trackClick } from "@/lib/contacts/clicks"
import { cn } from "@/lib/utils"

interface WishlistFormProps {
  /** Soft-highlight when search returned zero PDVs. */
  highlighted?: boolean
}

/**
 * Card curto — dispara WhatsApp pre-preenchido com mensagem unica de
 * "quero na minha cidade" pro time comercial filtrar leads B2C de demanda
 * por cidade. Sem form, sem captura, sem backend.
 */
export function WishlistForm({ highlighted }: WishlistFormProps) {
  const { urls } = useContacts()
  const cidadeHref = urls.cidade || "#contato"

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
      <div
        className="relative flex flex-col items-start gap-5 p-6 md:p-10"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(255,211,106,0.18), transparent 55%)," +
            "linear-gradient(180deg, #FFFDF7 0%, #FAFAF8 100%)",
        }}
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E87A1E] text-white text-[10px] font-black uppercase tracking-[0.22em] shadow-[0_6px_14px_-6px_rgba(232,122,30,0.6)]">
          <MapPin size={12} strokeWidth={2.6} />
          Ajuda a mapear
        </span>

        <h3
          id="quero-bang-bang-title"
          className="font-black uppercase text-[#1A1A1A] text-2xl md:text-3xl leading-[1.05] tracking-tight"
          style={{ fontFamily: "var(--font-heading-var)", fontWeight: 700 }}
        >
          Quero Bang Bang
          <br />
          <span className="text-[#E87A1E]">na minha cidade</span>.
        </h3>

        <p className="text-[#4A2C1A]/75 leading-relaxed text-[15px] max-w-xl">
          Não achou Bang Bang aí? Chama no WhatsApp — a gente registra a demanda
          e te avisa quando chegar.
        </p>

        {highlighted && (
          <div className="rounded-xl bg-[#E87A1E]/10 border border-[#E87A1E]/30 text-[#C4650F] px-3.5 py-2.5 text-sm font-semibold leading-snug">
            Sua busca não achou PDV. Clica aí pra deixar o pedido no WhatsApp.
          </div>
        )}

        <a
          href={cidadeHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick("cidade")}
          className={cn(
            "mt-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl",
            "bg-[#E87A1E] text-white font-black text-[13px] uppercase tracking-[0.16em]",
            "shadow-[0_16px_40px_-10px_rgba(232,122,30,0.55)]",
            "hover:bg-[#C4650F] hover:-translate-y-0.5 active:translate-y-0 transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E87A1E] focus-visible:ring-offset-2",
          )}
        >
          <MessageCircle size={16} strokeWidth={2.6} />
          Quero na minha cidade
          <ArrowRight size={16} strokeWidth={2.6} />
        </a>
      </div>
    </section>
  )
}
