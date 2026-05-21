# Render Performance — Fixes Aplicados

**Data:** 2026-05-21
**Branch:** main
**Build verificado:** `next build` (Turbopack) → success
**Antes vs depois:**

| Métrica | Antes | Depois | Δ |
|---|---|---|---|
| `out/index.html` | 993 KB | 227 KB | **−77%** |
| Latas (4 imagens) | 2 613 KB (PNG) | 327 KB (WebP) | **−87%** |
| `out/_next/static/chunks/` | 916 KB | 876 KB | −4% |
| JS total servido | 820 KB | 780 KB | −5% |
| Latas com `priority` no `<head>` | 4 (desktop) + 4 (mobile) | 1 | −7 preloads |

---

## Fixes aplicados

### 1 — Remover prop `pdvs` da home

**Causa-raiz:** `src/app/page.tsx:15` chamava `getMergedPDVs()` (400+ PDVs) e passava como prop pra `OndeComprarSection`. Mas a section usa `KPI_OVERRIDE = { pdvs: 416, cities: 67, states: 10 }` desde 2026-05-19 — a lista era serializada inteira no payload RSC e ignorada.

**Modificações:**
- `src/app/page.tsx` — removido `await getMergedPDVs()`, `Home` voltou a ser função síncrona, prop removida da chamada.
- `src/components/sections/OndeComprar/index.tsx` — assinatura sem props, sem `_pdvs`, removido `type PDV` import.
- `src/components/sections/OndeComprar/OndeComprarSection.stories.tsx` — story simplificada (sem `pdvsData`/`activeUfsData`).

**Resultado:** bloco `__next_f.push([1,"19:[\"$\",\"$L20\",null,{\"pdvs\":[...]}"])` saiu do HTML. ~833 KB economizados no payload inicial.

---

### 2 — Latas: PNG → WebP + redução de `priority`

**Causa-raiz:** `next.config.ts` força `images.unoptimized: true` (exigência do static export). 4 PNGs de ~640 KB cada eram servidos crus. Os 4 estavam com `priority` em desktop+mobile, gerando 8 `<link rel="preload" as="image">` no `<head>`.

**Modificações:**
- Conversão via `sharp` (`quality: 88, effort: 6`):

| | Antes | Depois |
|---|---|---|
| caipi | 631 KB PNG | 84 KB WebP |
| mule | 638 KB PNG | 72 KB WebP |
| spritz | 668 KB PNG | 88 KB WebP |
| bang | 676 KB PNG | 83 KB WebP |

- Imports atualizados em `HeroSection.tsx`, `SaboresSection.tsx`, `FAQSection.tsx`, `app/coming-soon/page.tsx`.
- `HeroSection.tsx:454` — `priority` reduzido de `i < 2` para `i === 1` (só a lata Mule, posicionada mais ao centro do hero desktop), com `fetchPriority="high"` explícito; demais latas `fetchPriority="low"`.
- `HeroSection.tsx:401` (mobile peek cans) — `priority` removido, trocado por `loading="lazy"` (latas mobile fazem bleed off-screen, não são LCP).
- `SaboresSection.tsx:710` — `priority` removido (Sabores está abaixo da dobra).

**Resultado:** payload de imagens crítico da home caiu de ~2,6 MB para ~327 KB. Preloads no `<head>` caíram de 8 latas para 1.

---

### 3 — Pausar RAF do Hero com IntersectionObserver

**Causa-raiz:** `HeroSection.tsx` rodava `requestAnimationFrame` infinito enquanto o componente existisse no DOM — mantendo o GPU compositor ativo mesmo com o usuário scrollado lá embaixo. Listener `pointermove` no `window` disparava em qualquer mexida de mouse na página inteira.

**Modificações em `src/components/sections/HeroSection.tsx`:**
- Adicionados helpers `start()` / `stop()` que atachan/dettach `pointermove` + `requestAnimationFrame` juntos.
- `IntersectionObserver` (threshold 0) chama `start()` quando o `<section>` entra no viewport e `stop()` quando sai.
- Cleanup do `useEffect` agora desconecta o IO e chama `stop()` final.

**Resultado:** fora do viewport, zero `pointermove` listeners, zero RAF ticks, zero re-paints do gradient. Bateria e fan deixam de ser sacrificados em sessão longa.

---

### 4 — Scroll listener do Sabores gated por IntersectionObserver

**Causa-raiz:** `SaboresSection.tsx` adicionava `window.addEventListener("scroll", ...)` no mount e nunca tirava. Cada scroll da home inteira disparava `getBoundingClientRect()` + `setState`, mesmo com o usuário ainda no Hero ou já no Footer.

**Modificações em `src/components/sections/SaboresSection.tsx`:**
- `attach()` / `detach()` agora gerenciam o `addEventListener("scroll")` e o `rafId` juntos.
- `IntersectionObserver` (com `rootMargin: "100px 0px"` para começar a observar antes do scroll-pin) só atacha o listener quando o wrapper de 520 vh está visível.
- Saiu do viewport → listener removido, RAF cancelado.

**Resultado:** scroll da página não dispara mais o update do Sabores quando ele não tá em cena. Reduz jank no Footer e nas seções acima do Sabores.

---

### 5 — Audit de `"use client"` — 4 sections + Footer viraram server

**Causa-raiz:** `RevendaSection`, `EventosSection`, `CTASection` e `Footer` estavam marcados `"use client"` só por usar `useContacts` (função síncrona pura, lê `process.env.NEXT_PUBLIC_*` em build-time) e `trackClick` (no-op stub para static export).

**Modificações:**
- `src/lib/contacts/useContacts.ts` — removido `"use client"` do topo. Adicionado export `getContacts = useContacts` (alias sem prefixo `use` para uso seguro em Server Components — React não tenta tratar como hook).
- `src/components/sections/CTASection.tsx` — removido `"use client"`, troca `useContacts` → `getContacts`, removido `onClick={() => trackClick("distribuidor")}` (era no-op).
- `src/components/sections/RevendaSection.tsx` — mesmo padrão.
- `src/components/sections/EventosSection.tsx` — mesmo padrão.
- `src/components/shared/Footer.tsx` — mesmo padrão.

**Resultado:** 4 árvores grandes saíram do bundle client. JS total caiu ~40 KB; mais importante, o hidration tree ficou menor e o Time-to-Interactive melhora porque essas seções não precisam mais ser re-executadas no browser. Footer especialmente — visível em toda página.

---

### 7 — Grain SVG centralizado em `lib/grain.ts`

**Causa-raiz:** 10 arquivos declaravam o mesmo `const GRAIN_URL = "url(\"data:image/svg+xml;utf8,<svg ...feTurbulence...>\")"` (~480 chars cada). Duplicação no source, duplicação no bundle.

**Modificações:**
- Novo arquivo `src/lib/grain.ts` exporta `GRAIN_URL`.
- Bloco `const GRAIN_URL = "..."` removido de:
  - `src/components/shared/Footer.tsx`
  - `src/components/shared/AgeGate.tsx`
  - `src/components/sections/CTASection.tsx`
  - `src/components/sections/EventosSection.tsx`
  - `src/components/sections/FAQSection.tsx`
  - `src/components/sections/FAQAccordion.tsx`
  - `src/components/sections/SaboresSection.tsx`
  - `src/components/sections/HeroSection.tsx` (era inline no JSX, sem `const`)
  - `src/app/coming-soon/page.tsx`
  - `src/components/onde-encontrar/OndeEncontrarHero.tsx`
- Import `import { GRAIN_URL } from "@/lib/grain"` adicionado em cada um.

**Resultado:** ~4,3 KB de fonte deduplicados, single source of truth para a textura.

---

## Itens não aplicados (decisão consciente)

- **Fix 6 — AgeGate `filter:blur` → `backdrop-filter`** — pulado porque muda o look visual do blur do modal (Pedro precisa aprovar antes/depois).
- **Reduzir `SPARK_COUNT` no Hero (18 → 8) / remover drop-shadow duplo / mudar gradient mouse-tracked** — pulado, mudanças visuais perceptíveis, precisa aprovação.
- **Remover `Permanent_Marker` font** — não auditado se está em uso.

---

## Como validar localmente

```bash
npm run build
ls -lh out/index.html                       # ~227 KB
ls -lh public/images/latas/*.webp           # 4 arquivos 72-88 KB
grep -c PDV- out/index.html                 # 0
grep -c feTurbulence src/lib/grain.ts       # 1 (single source)
```
