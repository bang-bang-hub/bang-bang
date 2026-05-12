# Bang Bang — Site (Static Export)

Site institucional/comercial da Bang Bang (bebidas RTD).
Next.js 14+ com `output: 'export'` — HTML/CSS/JS estático puro, sem servidor.

---

## Stack

- Next.js 14+ (App Router, static export)
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui
- Storybook

---

## Comandos

```bash
npm install          # instalar dependências
npm run dev          # servidor local (http://localhost:3000)
npm run build        # gera /out com o site estático
npm run pdvs:refresh # atualizar PDVs a partir do xlsx (manual, precisa de rede)
npm run pdvs:validate # validar src/data/pdvs*.json (roda no prebuild)
npm run storybook    # Storybook (http://localhost:6006)
```

---

## Configuração de ambiente

Copie `.env.example` para `.env.local` e preencha os números de WhatsApp:

```bash
cp .env.example .env.local
```

Variáveis disponíveis (todas opcionais — CTA volta ao `#contato` se vazias):

| Var | Descrição |
|-----|-----------|
| `NEXT_PUBLIC_WA_REVENDA` | WhatsApp comercial revenda (digits only, ex: `5531999999999`) |
| `NEXT_PUBLIC_WA_DISTRIBUIDOR` | WhatsApp comercial distribuição |
| `NEXT_PUBLIC_WA_EVENTOS` | WhatsApp ativações e eventos |
| `NEXT_PUBLIC_LINK_REVENDA` | Link customizado (wa.me ou outro) — sobrescreve o número |
| `NEXT_PUBLIC_LINK_DISTRIBUIDOR` | Link customizado distribuição |
| `NEXT_PUBLIC_LINK_EVENTOS` | Link customizado eventos |

---

## Pipeline de PDVs

Os dados de pontos de venda ficam em `src/data/pdvs.json` (commitado).
Para atualizar a partir da planilha:

```bash
npm run pdvs:refresh   # lê data/pdvs_bang_bang.xlsx → gera src/data/pdvs.json
npm run build          # prebuild valida o JSON automaticamente
```

O script usa ViaCEP (enriquecer endereços) e Nominatim (geocoding).
Os caches ficam em `data/.viacep-cache.json` e `data/.geocoding-cache.json` (commitados).

---

## Build estático e deploy

```bash
npm run build          # gera /out
```

O diretório `/out` pode ser publicado em qualquer host estático:

### Azure Static Web Apps (Free tier — $0/mês)

1. Crie um SWA no portal Azure (Free tier)
2. Conecte ao repositório GitHub (branch `main`)
3. Em "Build Details":
   - App location: `/`
   - Output location: `out`
   - API location: (deixe vazio)
4. Configure as variáveis de ambiente no portal (Application Settings)
5. Push na branch `main` aciona o deploy automático

### Outras opções

- **Netlify**: drag-and-drop da pasta `out`, ou conecte o repo com comando `next build`
- **Vercel**: configurar como "Other" framework com output directory `out`
- **GitHub Pages**: publicar a pasta `out` via `gh-pages` action

---

## Estrutura de pastas

```
src/
  app/                  → Páginas (App Router)
    page.tsx            → Home
    coming-soon/        → Tela de espera (coming soon)
    layout.tsx          → Layout raiz
  components/
    sections/           → Seções da home (Hero, Sabores, FAQ, etc.)
    shared/             → Componentes reutilizáveis (Header, Footer, etc.)
    onde-encontrar/     → WishlistForm
    ui/                 → shadcn customizados
  lib/
    contacts/           → useContacts (env vars), trackClick (no-op)
    faq/                → config (DEFAULT_FAQ), server (retorna defaults)
    pdvs/               → server (JSON estático), types
    wishlist/           → config (tipos e EMPTY_REQUEST)
    utils.ts
  data/                 → pdvs.json, pdvs-meta.json (build-time)
data/                   → xlsx fonte + caches (não sobrescrever manualmente)
scripts/                → build-pdvs.ts, validate-pdvs.ts
public/                 → assets estáticos
docs/                   → documentação estratégica do projeto
```

---

## Documentação

| Arquivo | Conteúdo |
|---------|----------|
| `docs/BRAND_CONTEXT.md` | Marca, tom, personas, públicos |
| `docs/DESIGN_TOKENS.md` | Cores, tipografia, espaçamento |
| `docs/HOME_ARCHITECTURE.md` | Seções da home + mapa de componentes |
| `docs/ANTI_PATTERNS.md` | O que NÃO repetir |
| `docs/COPY_HOME.md` | Textos aprovados |
| `docs/COMPONENT_SPECS.md` | Especificação técnica dos componentes |
| `docs/SEO_METADATA.md` | Meta tags e schema markup |

---

Accellera — Projeto Bang Bang Site | Static Export
Atualizado: 2026-05-12
