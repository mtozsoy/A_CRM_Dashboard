'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  contacts,
  salesOpportunities,
  tasks,
  calendarEvents,
  campaigns,
  reports,
  supportTickets,
} from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

function sanitizeData(data: Record<string, any>): any {
  const sanitized = { ...data } as any
  for (const key in sanitized) {
    if (sanitized[key] === '') {
      sanitized[key] = null
    } else if (
      (key === 'dueDate' || key === 'startTime' || key === 'endTime') &&
      typeof sanitized[key] === 'string'
    ) {
      sanitized[key] = new Date(sanitized[key])
    }
  }
  return sanitized
}

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return 'demo-user-id'
  return session.user.id
}

// ============ CONTACTS ============

export async function getContacts() {
  const userId = await getUserId()
  return db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .orderBy(desc(contacts.createdAt))
}

export async function createContact(data: {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  jobTitle?: string
  industry?: string
  notes?: string
  source?: string
}) {
  const userId = await getUserId()
  const result = await db
    .insert(contacts)
    .values({
      userId,
      ...sanitizeData(data),
    })
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function updateContact(
  id: number,
  data: Partial<Parameters<typeof createContact>[0]>,
) {
  const userId = await getUserId()
  const result = await db
    .update(contacts)
    .set(sanitizeData(data))
    .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteContact(id: number) {
  const userId = await getUserId()
  await db
    .delete(contacts)
    .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
  revalidatePath('/')
}

export async function getContactProfile(contactId: number) {
  const userId = await getUserId()

  const [contact] = await db
    .select()
    .from(contacts)
    .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)))

  if (!contact) return null

  const opps = await db
    .select()
    .from(salesOpportunities)
    .where(and(eq(salesOpportunities.contactId, contactId), eq(salesOpportunities.userId, userId)))
    .orderBy(desc(salesOpportunities.createdAt))

  const contactTasks = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.relatedContactId, contactId), eq(tasks.userId, userId)))
    .orderBy(desc(tasks.createdAt))

  const tickets = await db
    .select()
    .from(supportTickets)
    .where(and(eq(supportTickets.contactId, contactId), eq(supportTickets.userId, userId)))
    .orderBy(desc(supportTickets.createdAt))

  return {
    contact,
    opportunities: opps,
    tasks: contactTasks,
    tickets,
  }
}

// ============ SALES OPPORTUNITIES ============

export async function getSalesOpportunities() {
  const userId = await getUserId()
  return db
    .select()
    .from(salesOpportunities)
    .where(eq(salesOpportunities.userId, userId))
    .orderBy(desc(salesOpportunities.createdAt))
}

export async function createSalesOpportunity(data: {
  contactId?: number
  title: string
  description?: string
  amount?: string
  currency?: string
  stage: string
  probability?: number
  expectedCloseDate?: string
}) {
  const userId = await getUserId()
  const result = await db
    .insert(salesOpportunities)
    .values({
      userId,
      ...sanitizeData(data),
    })
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function updateSalesOpportunity(
  id: number,
  data: Partial<Parameters<typeof createSalesOpportunity>[0]>,
) {
  const userId = await getUserId()
  const result = await db
    .update(salesOpportunities)
    .set(sanitizeData(data))
    .where(and(eq(salesOpportunities.id, id), eq(salesOpportunities.userId, userId)))
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteSalesOpportunity(id: number) {
  const userId = await getUserId()
  await db
    .delete(salesOpportunities)
    .where(and(eq(salesOpportunities.id, id), eq(salesOpportunities.userId, userId)))
  revalidatePath('/')
}

// ============ TASKS ============

export async function getTasks() {
  const userId = await getUserId()
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.createdAt))
}

export async function createTask(data: {
  title: string
  description?: string
  dueDate?: string
  priority?: string
  status?: string
  relatedContactId?: number
  relatedOpportunityId?: number
}) {
  const userId = await getUserId()
  const result = await db
    .insert(tasks)
    .values({
      userId,
      ...sanitizeData(data),
    })
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function updateTask(
  id: number,
  data: Partial<Parameters<typeof createTask>[0]>,
) {
  const userId = await getUserId()
  const result = await db
    .update(tasks)
    .set(sanitizeData(data))
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteTask(id: number) {
  const userId = await getUserId()
  await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
  revalidatePath('/')
}

// ============ CALENDAR EVENTS ============

export async function getCalendarEvents() {
  const userId = await getUserId()
  return db
    .select()
    .from(calendarEvents)
    .where(eq(calendarEvents.userId, userId))
    .orderBy(desc(calendarEvents.startTime))
}

export async function createCalendarEvent(data: {
  title: string
  description?: string
  startTime: string
  endTime: string
  eventType?: string
  relatedContactId?: number
  relatedOpportunityId?: number
}) {
  const userId = await getUserId()
  const result = await db
    .insert(calendarEvents)
    .values({
      userId,
      ...sanitizeData(data),
    })
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteCalendarEvent(id: number) {
  const userId = await getUserId()
  await db
    .delete(calendarEvents)
    .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)))
  revalidatePath('/')
}

// ============ CAMPAIGNS ============

export async function getCampaigns() {
  const userId = await getUserId()
  return db
    .select()
    .from(campaigns)
    .where(eq(campaigns.userId, userId))
    .orderBy(desc(campaigns.createdAt))
}

export async function createCampaign(data: {
  name: string
  description?: string
  status?: string
  startDate?: string
  endDate?: string
  budget?: string
  targetAudience?: string
}) {
  const userId = await getUserId()
  const result = await db
    .insert(campaigns)
    .values({
      userId,
      ...sanitizeData(data),
    })
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function updateCampaign(
  id: number,
  data: Partial<Parameters<typeof createCampaign>[0]>,
) {
  const userId = await getUserId()
  const result = await db
    .update(campaigns)
    .set(sanitizeData(data))
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)))
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteCampaign(id: number) {
  const userId = await getUserId()
  await db
    .delete(campaigns)
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)))
  revalidatePath('/')
}

// ============ REPORTS ============

export async function getReports() {
  const userId = await getUserId()
  return db
    .select()
    .from(reports)
    .where(eq(reports.userId, userId))
    .orderBy(desc(reports.createdAt))
}

export async function createReport(data: {
  reportType: string
  title: string
  description?: string
  data?: Record<string, any>
}) {
  const userId = await getUserId()
  const result = await db
    .insert(reports)
    .values({
      userId,
      ...sanitizeData(data),
    })
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteReport(id: number) {
  const userId = await getUserId()
  await db
    .delete(reports)
    .where(and(eq(reports.id, id), eq(reports.userId, userId)))
  revalidatePath('/')
}

// ============ SUPPORT TICKETS ============

export async function getSupportTickets() {
  const userId = await getUserId()
  return db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.userId, userId))
    .orderBy(desc(supportTickets.createdAt))
}

export async function createSupportTicket(data: {
  contactId?: number
  subject: string
  description: string
  status?: string
  priority?: string
}) {
  const userId = await getUserId()
  const result = await db
    .insert(supportTickets)
    .values({
      userId,
      ...sanitizeData(data),
    })
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function updateSupportTicket(
  id: number,
  data: Partial<Parameters<typeof createSupportTicket>[0]>,
) {
  const userId = await getUserId()
  const result = await db
    .update(supportTickets)
    .set(sanitizeData(data))
    .where(and(eq(supportTickets.id, id), eq(supportTickets.userId, userId)))
    .returning()
  revalidatePath('/')
  return result[0]
}

export async function deleteSupportTicket(id: number) {
  const userId = await getUserId()
  await db
    .delete(supportTickets)
    .where(and(eq(supportTickets.id, id), eq(supportTickets.userId, userId)))
  revalidatePath('/')
}

// ============ DASHBOARD STATS ============

export async function getDashboardStats() {
  const userId = await getUserId()

  const allContacts = await db.select().from(contacts).where(eq(contacts.userId, userId))
  const allOpps = await db.select().from(salesOpportunities).where(eq(salesOpportunities.userId, userId))
  const allTasks = await db.select().from(tasks).where(eq(tasks.userId, userId))
  const allTickets = await db.select().from(supportTickets).where(eq(supportTickets.userId, userId))

  // Metrics
  const totalContacts = allContacts.length
  const totalPipelineValue = allOpps.reduce((sum, opp) => sum + Number(opp.amount || 0), 0)
  const activeTasks = allTasks.filter((t) => t.status !== 'tamamlandı' && t.status !== 'iptal edildi').length
  const openTickets = allTickets.filter((t) => t.status === 'open' || t.status === 'in-progress').length

  // Pipeline Chart Data
  const pipelineByStage = allOpps.reduce((acc, opp) => {
    acc[opp.stage] = (acc[opp.stage] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pipelineChartData = Object.entries(pipelineByStage).map(([name, count]) => ({
    name,
    count,
  }))

  // Tasks Chart Data
  const tasksByStatus = allTasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const taskChartData = Object.entries(tasksByStatus).map(([name, value]) => ({
    name,
    value,
  }))

  return {
    metrics: {
      totalContacts,
      totalPipelineValue,
      activeTasks,
      openTickets,
    },
    charts: {
      pipeline: pipelineChartData,
      tasks: taskChartData,
    }
  }
}

