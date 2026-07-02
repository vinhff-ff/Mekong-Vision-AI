const MASS_KG = 0.2

interface ClassParams {
  vwPerItem:  number
  co2PerItem: number
  credits:    number
}

const CLASS_PARAMS: Record<string, ClassParams> = {
  'Class 1': { vwPerItem: 2700, co2PerItem: 0.6, credits: 1 },
  'Class 2': { vwPerItem: 600,  co2PerItem: 0.6, credits: 1 },
  'Class 3': { vwPerItem: 1,    co2PerItem: 0.6, credits: 1 },
}

const DEFAULT_PARAMS: ClassParams = { vwPerItem: 0, co2PerItem: 0, credits: 0 }

export interface LedgerEntry {
  id:         string
  timestamp:  number
  className:  string
  massKg:     number
  vwSaved:    number
  co2Avoided: number
  credits:    number
  image:      string   // base64 dataURL của ảnh chụp
}

export interface LedgerTotals {
  entries:         LedgerEntry[]
  totalItems:      number
  totalMassKg:     number
  totalVwSaved:    number
  totalCo2Avoided: number
  totalCredits:    number
}

const STORAGE_KEY = 'green_pulse_ledger'

function readStorage(): LedgerEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useGreenLedger() {
  const addEntry = (className: string, image: string): LedgerEntry => {
    const p = CLASS_PARAMS[className] ?? DEFAULT_PARAMS
    const entry: LedgerEntry = {
      id:         crypto.randomUUID(),
      timestamp:  Date.now(),
      className,
      massKg:     MASS_KG,
      vwSaved:    p.vwPerItem,
      co2Avoided: p.co2PerItem,
      credits:    p.credits,
      image,
    }
    const prev = readStorage()
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...prev, entry]))
    return entry
  }

  const getTotals = (): LedgerTotals => {
    const entries = readStorage()
    return {
      entries,
      totalItems:      entries.length,
      totalMassKg:     entries.length * MASS_KG,
      totalVwSaved:    entries.reduce((s, e) => s + e.vwSaved,    0),
      totalCo2Avoided: entries.reduce((s, e) => s + e.co2Avoided, 0),
      totalCredits:    entries.reduce((s, e) => s + e.credits,    0),
    }
  }

  const clearLedger = () => localStorage.removeItem(STORAGE_KEY)

  return { addEntry, getTotals, clearLedger }
}