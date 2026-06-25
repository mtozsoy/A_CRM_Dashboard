'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { accounts, transactions } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// ============ ACCOUNTS ============

export async function getAccounts() {
  const userId = await getUserId()
  return db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId))
    .orderBy(desc(accounts.createdAt))
}

export async function createAccount(data: {
  name: string
  type: string
  currency: string
  initialBalance: string
}) {
  const userId = await getUserId()
  const result = await db
    .insert(accounts)
    .values({
      userId,
      ...data,
    })
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteAccount(id: number) {
  const userId = await getUserId()
  await db
    .delete(accounts)
    .where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
  revalidatePath('/')
}

// ============ TRANSACTIONS ============

export async function getTransactions() {
  const userId = await getUserId()
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date))
}

export async function createTransaction(data: {
  accountId: number
  type: string
  amount: string
  category: string
  description?: string
  date: Date
}) {
  const userId = await getUserId()
  const result = await db
    .insert(transactions)
    .values({
      userId,
      ...data,
    })
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteTransaction(id: number) {
  const userId = await getUserId()
  await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
  revalidatePath('/')
}
