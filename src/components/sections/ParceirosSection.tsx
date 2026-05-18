import Image from "next/image"
import { Container } from "@/components/shared/Container"
import { SectionWrapper } from "@/components/shared/SectionWrapper"

type PartnerLogo = {
  name: string
  src: string
}

const LOGOS: PartnerLogo[] = [
  { name: "Farid Supermercados",     src: "/images/parceiros/farid.png" },
  { name: "Bhzão Atacado & Varejo",  src: "/images/parceiros/bhzao.png" },
  { name: "DOS3 Distribuidora",      src: "/images/parceiros/dos3.png" },
  { name: "Farnezze Supermercados",  src: "/images/parceiros/farnezze.png" },
  { name: "Magnatas Distribuidora",  src: "/images/parceiros/magnatas.png" },
  { name: "Alasca Bebidas",          src: "/images/parceiros/alasca.png" },
  { name: "Nova Contagem Supermercados", src: "/images/parceiros/nova-contagem.png" },
  { name: "NaFaixa",                 src: "/images/parceiros/na-faixa.png" },
  { name: "Paulão Beer",             src: "/images/parceiros/paulao.png" },
]

// Double the list so the CSS marquee (translateX 0 → -50%) loops seamlessly.
const DOUBLED = [...LOGOS, ...LOGOS]

interface ParceirosBlockProps {
  /** Background color used by the edge fades (so the loop seam blends). Pass
   * the host section's bg color as hex. Defaults to #FAFAF8 (light surface). */
  fadeColor?: string
  className?: string
}

/**
 * Headline + marquee-of-logos block, wrapper-less. Used by ParceirosSection
 * (stand-alone) and by RevendaSection (rendered as a footer block under the
 * B2B feature cards so the home keeps the "argumento + prova social" pair on
 * a single fold).
 */
export function ParceirosBlock({
  fadeColor = "#FAFAF8",
  className,
}: ParceirosBlockProps) {
  return (
    <div className={className}>
      <Container>
        <div className="flex flex-col items-center text-center gap-3">
          <span className="inline-flex items-center gap-2.5 text-[10px] md:text-[11px] font-semibold tracking-[0.28em] uppercase px-3.5 py-2 rounded-full border border-[#2D1810]/20 bg-white/60 backdrop-blur-md text-[#4A2C1A]">
            <span className="w-2 h-2 rounded-full bg-[#E87A1E] shadow-[0_0_10px_#E87A1E]" />
            Parceiros
          </span>
          <h3
            className="font-black uppercase text-[#1A1A1A] tracking-tight leading-[0.95]"
            style={{
              fontFamily: "var(--font-heading-var)",
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            }}
          >
            Quem vende, sabe.
          </h3>
          <p className="text-sm md:text-[15px] text-[#4A2C1A]/65">
            Distribuidoras, mercados e bares que já botaram Bang Bang na geladeira.
          </p>
        </div>
      </Container>

      {/* Carousel — edge-to-edge inside the host section, seamless CSS marquee. */}
      <div
        className="marquee-container relative mt-8 w-full overflow-hidden"
        aria-label="Parceiros Bang Bang"
      >
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${fadeColor}, transparent)` }}
        />
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${fadeColor}, transparent)` }}
        />

        <div
          className="marquee-track flex flex-row flex-nowrap items-center gap-5 md:gap-8 py-2"
          style={{ animation: "marquee 40s linear infinite" }}
        >
          {DOUBLED.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="relative shrink-0 h-16 md:h-20 w-32 md:w-40"
              {...(i >= LOGOS.length ? { "aria-hidden": true } : {})}
            >
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                sizes="(max-width: 768px) 128px, 160px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Stand-alone section wrapper around ParceirosBlock. Kept on the API for any
 *  page that wants Parceiros as its own fold (today only stories use this — the
 *  home merges Parceiros into RevendaSection as a footer block). */
export function ParceirosSection() {
  return (
    <SectionWrapper id="parceiros" bg="light" py="sm">
      <ParceirosBlock />
    </SectionWrapper>
  )
}
