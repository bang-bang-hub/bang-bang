import basePDVsJson from "@/data/pdvs.json"
import type { PDV, PDVsByUF, UF } from "@/lib/types/pdv"

/**
 * Returns the build-time PDV dataset for the static export build.
 *
 * The original implementation merged the base JSON with dashboard overrides
 * stored in Supabase (pdv_overrides table). With static export there is no
 * server runtime, so we serve the JSON directly as produced by `pdvs:refresh`.
 *
 * To update the PDV list: edit data/pdvs_bang_bang.xlsx and run
 * `npm run pdvs:refresh`, then rebuild.
 */

const BASE = basePDVsJson as PDV[]

interface MergedPDVs {
  pdvs: PDV[]
  activeUfs: PDVsByUF[]
}

export async function getMergedPDVs(): Promise<MergedPDVs> {
  const counts = new Map<UF, number>()
  for (const p of BASE) counts.set(p.uf, (counts.get(p.uf) ?? 0) + 1)
  const activeUfs: PDVsByUF[] = [...counts.entries()]
    .map(([uf, count]) => ({ uf, count }))
    .sort((a, b) => b.count - a.count)

  return { pdvs: BASE, activeUfs }
}
