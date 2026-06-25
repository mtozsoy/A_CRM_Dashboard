import { pgTable, text, timestamp, boolean, serial, integer, decimal, date, jsonb } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
// export const todos = pgTable("todos", {
//   id: serial("id").primaryKey(),
//   userId: text("userId").notNull(),
//   title: text("title").notNull(),
//   completed: boolean("completed").notNull().default(false),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
// })
//
// If the user asks for foreign keys, add the reference back in:
//   userId: text("userId")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),

// --- CRM Tables ---

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  jobTitle: text('jobTitle'),
  industry: text('industry'),
  notes: text('notes'),
  status: text('status').notNull().default('active'),
  source: text('source'),
  rating: integer('rating').default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const salesOpportunities = pgTable('sales_opportunities', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  contactId: integer('contactId'),
  title: text('title').notNull(),
  description: text('description'),
  amount: decimal('amount', { precision: 14, scale: 2 }),
  currency: text('currency').notNull().default('USD'),
  stage: text('stage').notNull(),
  probability: integer('probability').default(0),
  expectedCloseDate: date('expectedCloseDate'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: timestamp('dueDate'),
  priority: text('priority').notNull().default('medium'),
  status: text('status').notNull().default('open'),
  relatedContactId: integer('relatedContactId'),
  relatedOpportunityId: integer('relatedOpportunityId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const calendarEvents = pgTable('calendar_events', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  startTime: timestamp('startTime').notNull(),
  endTime: timestamp('endTime').notNull(),
  eventType: text('eventType'),
  relatedContactId: integer('relatedContactId'),
  relatedOpportunityId: integer('relatedOpportunityId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull().default('draft'),
  startDate: date('startDate'),
  endDate: date('endDate'),
  budget: decimal('budget', { precision: 14, scale: 2 }),
  targetAudience: text('targetAudience'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  reportType: text('reportType').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  data: jsonb('data'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const supportTickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  contactId: integer('contactId'),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('open'), // open, in-progress, resolved, closed
  priority: text('priority').notNull().default('medium'), // low, medium, high, urgent
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
