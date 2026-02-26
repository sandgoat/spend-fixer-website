export interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'plus' | 'pro'
  createdAt: string
}

export interface Transaction {
  id: string
  accountId: string
  date: string
  merchant: string
  amount: number
  category: string
  pending: boolean
}

export interface Budget {
  id: string
  userId: string
  category: string
  limit: number
  spent: number
  period: 'weekly' | 'monthly'
}

export interface Goal {
  id: string
  userId: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
}

export interface Account {
  id: string
  userId: string
  plaidItemId: string
  name: string
  type: 'checking' | 'savings' | 'credit' | 'investment'
  balance: number
  lastSync: string
}
