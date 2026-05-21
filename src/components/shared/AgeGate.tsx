"use client"

import { useEffect, useState } from "react"
import { Logo } from "@/components/shared/Logo"
import { GRAIN_URL } from "@/lib/grain"
import caipiImg from "@/../public/images/latas/caipi.webp"
import muleImg from "@/../public/images/latas/mule.webp"
import spritzImg from "@/../public/images/latas/spritz.webp"
import bangImg from "@/../public/images/latas/bang.webp"

const COOKIE_NAME = "bb_age_ok"
const TTL_DAYS = 7

// Lata image URLs (build-time hashed paths). Pre-fetched while the modal
// is open so the Hero/Sabores latas are already in the HTTP cache when the
// user confirms age.
const LATA_URLS = [caipiImg.src, muleImg.src, spritzImg.src, bangImg.src]


function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(
    new RegExp("(^|; )" + name + "=([^;]+)"),
  )
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

/**
 * AgeGate — popup full-screen pra confirmar maioridade antes de exibir o site.
 *
 * Static export friendly: client-side only, sem backend, sem localStorage
 * (proibido por CLAUDE.md). Persistencia via cookie com TTL configuravel.
 * Renderiza apos mount pra evitar mismatch de hidratacao + flash do conteudo.
 */
export function AgeGate() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (readCookie(COOKIE_NAME) !== "1") {
      setOpen(true)
    }
  }, [])

  // Trava scroll do body + adiciona classe pra CSS aplicar blur no resto
  // do conteudo (regra em globals.css usa o seletor body.age-gate-open).
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.body.classList.add("age-gate-open")
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.classList.remove("age-gate-open")
    }
  }, [open])

  // Warm the HTTP cache with all 4 lata WebPs while the user reads the modal.
  // By the time they tap "Sim, sou maior", the Hero/Sabores latas are already
  // cached and paint instantly.
  useEffect(() => {
    if (!open) return
    LATA_URLS.forEach((url) => {
      const img = new Image()
      // fetchPriority is supported in recent Chromium/Safari; harmless elsewhere.
      ;(img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "high"
      img.decoding = "async"
      img.src = url
    })
  }, [open])

  if (!mounted || !open) return null

  const confirm = () => {
    setCookie(COOKIE_NAME, "1", TTL_DAYS)
    setOpen(false)
  }

  const reject = () => {
    window.location.href = "https://www.google.com"
  }

  return (
    <div
      data-age-gate-modal
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Overlay escuro — blur de fato vem do CSS aplicado no body.age-gate-open. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#1A0F0A]/80"
      />

      <div
        className="relative w-full max-w-md rounded-2xl text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] overflow-hidden border border-white/10"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(255,210,130,0.22), transparent 55%)," +
            "linear-gradient(160deg, #2a1410 0%, #6a2a14 50%, #E85D10 130%)",
        }}
      >
        {/* Film grain — mesma textura do hero. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.18]"
          style={{ backgroundImage: GRAIN_URL }}
        />

        <div className="relative z-[1] flex flex-col items-center text-center gap-5 px-6 py-9 md:px-8 md:py-10">
          <Logo variant="white" height={52} />

          <h2
            id="age-gate-title"
            className="font-black uppercase text-2xl md:text-3xl leading-[1.05] tracking-tight"
            style={{ fontFamily: "var(--font-heading-var)", fontWeight: 700 }}
          >
            Você tem 18 anos ou mais?
          </h2>

          <p className="text-white/80 text-sm md:text-[15px] leading-relaxed max-w-xs">
            Bang Bang é bebida alcoólica. Confirma sua idade pra continuar.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-1">
            <button
              type="button"
              onClick={confirm}
              className="flex-1 h-12 rounded-xl font-black text-sm uppercase tracking-[0.16em] bg-[#E87A1E] text-white shadow-[0_12px_28px_-10px_rgba(232,122,30,0.7)] hover:bg-[#C4650F] hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd36a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1410]"
            >
              Sim, sou maior
            </button>
            <button
              type="button"
              onClick={reject}
              className="flex-1 h-12 rounded-xl font-bold text-sm uppercase tracking-[0.12em] border border-white/40 text-white bg-white/5 hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1410]"
            >
              Não
            </button>
          </div>

          <p className="text-[10px] text-white/55 mt-1 uppercase tracking-[0.18em] font-bold">
            Beba com moderação · Venda proibida p/ menores de 18
          </p>
        </div>
      </div>
    </div>
  )
}
