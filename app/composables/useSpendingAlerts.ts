import type { Transaction, Budget } from '~/types'

export interface SpendingAlert {
  id: string
  type: 'unusual_spike' | 'budget_warning' | 'budget_exceeded' | 'recurring_charge' | 'large_transaction'
  message: string
  severity: 'info' | 'warning' | 'danger'
  dismissible: boolean
  category?: string
  amount?: number
}

const SUBSCRIPTION_PATTERNS = [
  'netflix', 'hulu', 'spotify', 'apple', 'amazon prime', 'disney',
  'youtube premium', 'hbo', 'paramount', 'peacock', 'siriusxm',
  'dropbox', 'icloud', 'google one', 'adobe', 'microsoft 365',
  'gym', 'planet fitness', 'anytime fitness',
]

const LARGE_TX_THRESHOLD = 100

const DISMISSED_KEY = 'spendfixer:dismissed_alerts'

function getDismissed(): Set<string> {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function saveDismissed(ids: Set<string>) {
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]))
  } catch {}
}

export function useSpendingAlerts(
  transactions: Ref<Transaction[]> | ComputedRef<Transaction[]>,
  budgets: Ref<Budget[]> | ComputedRef<Budget[]>,
) {
  const dismissed = ref<Set<string>>(new Set())

  onMounted(() => {
    dismissed.value = getDismissed()
  })

  const alerts = computed<SpendingAlert[]>(() => {
    const txs = transactions.value
    const buds = budgets.value
    const result: SpendingAlert[] = []

    const now = new Date()
    const todayStr = now.toISOString().slice(0, 10)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // --- 1. Unusual spike ---
    const todayTxs = txs.filter(t => t.date?.slice(0, 10) === todayStr && t.amount > 0)
    const recentTxs = txs.filter(t => {
      const d = new Date(t.date)
      return d >= thirtyDaysAgo && t.amount > 0
    })
    const spentToday = todayTxs.reduce((s, t) => s + t.amount, 0)

    if (recentTxs.length > 0) {
      // Group by day to get daily totals
      const byDay: Record<string, number> = {}
      recentTxs.forEach(t => {
        const day = t.date?.slice(0, 10)
        if (day) byDay[day] = (byDay[day] || 0) + t.amount
      })
      const days = Object.values(byDay)
      const avg30 = days.reduce((s, v) => s + v, 0) / Math.max(days.length, 1)
      if (avg30 > 0 && spentToday > avg30 * 2) {
        const alertId = `spike:${todayStr}`
        if (!dismissed.value.has(alertId)) {
          result.push({
            id: alertId,
            type: 'unusual_spike',
            message: `You've spent $${spentToday.toFixed(2)} today — more than 2× your $${avg30.toFixed(2)} daily average.`,
            severity: 'warning',
            dismissible: true,
            amount: spentToday,
          })
        }
      }
    }

    // --- 2 & 3. Budget warning / exceeded ---
    buds.forEach(b => {
      const pct = b.limit > 0 ? (b.spent / b.limit) * 100 : 0
      const label = b.category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      if (pct > 100) {
        const alertId = `budget_exceeded:${b.id}`
        if (!dismissed.value.has(alertId)) {
          result.push({
            id: alertId,
            type: 'budget_exceeded',
            message: `${label} budget exceeded — spent $${b.spent.toFixed(2)} of $${b.limit.toFixed(2)} limit.`,
            severity: 'danger',
            dismissible: true,
            category: b.category,
          })
        }
      } else if (pct >= 80) {
        const alertId = `budget_warning:${b.id}`
        if (!dismissed.value.has(alertId)) {
          result.push({
            id: alertId,
            type: 'budget_warning',
            message: `${label} is at ${Math.round(pct)}% of your $${b.limit.toFixed(2)} budget.`,
            severity: 'warning',
            dismissible: true,
            category: b.category,
          })
        }
      }
    })

    // --- 4. Recurring charge detected ---
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const recentSubs = txs.filter(t => {
      const d = new Date(t.date)
      if (d < sevenDaysAgo) return false
      const merchantLower = (t.merchant || '').toLowerCase()
      return SUBSCRIPTION_PATTERNS.some(p => merchantLower.includes(p))
    })
    recentSubs.forEach(t => {
      const alertId = `recurring:${t.id}`
      if (!dismissed.value.has(alertId)) {
        result.push({
          id: alertId,
          type: 'recurring_charge',
          message: `Subscription charge: ${t.merchant} — $${t.amount.toFixed(2)}. Still using it?`,
          severity: 'info',
          dismissible: true,
          amount: t.amount,
        })
      }
    })

    // --- 5. Large transaction ---
    const largeTxs = txs.filter(t => {
      const d = new Date(t.date)
      return d >= sevenDaysAgo && t.amount >= LARGE_TX_THRESHOLD
    })
    largeTxs.forEach(t => {
      const alertId = `large:${t.id}`
      if (!dismissed.value.has(alertId)) {
        result.push({
          id: alertId,
          type: 'large_transaction',
          message: `Large charge: $${t.amount.toFixed(2)} at ${t.merchant || 'Unknown merchant'}.`,
          severity: 'warning',
          dismissible: true,
          amount: t.amount,
        })
      }
    })

    return result
  })

  function dismissAlert(id: string) {
    dismissed.value = new Set([...dismissed.value, id])
    saveDismissed(dismissed.value)
  }

  return { alerts, dismissAlert }
}
