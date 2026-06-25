'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  contacts,
  salesOpportunities,
  tasks,
  supportTickets,
} from '@/lib/db/schema'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

const mockContacts = [
  { firstName: 'Ahmet', lastName: 'Yılmaz', email: 'ahmet@example.com', company: 'Yılmaz A.Ş.', status: 'active', rating: 5 },
  { firstName: 'Ayşe', lastName: 'Kaya', email: 'ayse@example.com', company: 'Kaya Tech', status: 'active', rating: 4 },
  { firstName: 'Mehmet', lastName: 'Demir', email: 'mehmet@example.com', company: 'Demir Lojistik', status: 'active', rating: 3 },
  { firstName: 'Fatma', lastName: 'Çelik', email: 'fatma@example.com', company: 'Çelik Yazılım', status: 'active', rating: 5 },
  { firstName: 'Ali', lastName: 'Can', email: 'ali@example.com', company: 'Can Ticaret', status: 'active', rating: 4 },
  { firstName: 'Zeynep', lastName: 'Şahin', email: 'zeynep@example.com', company: 'Şahin Mimarlık', status: 'active', rating: 2 },
  { firstName: 'Mustafa', lastName: 'Öztürk', email: 'mustafa@example.com', company: 'Öztürk İnşaat', status: 'inactive', rating: 1 },
]

const mockOpps = [
  { title: 'Kurumsal Yazılım Yenileme', amount: '150000', stage: 'Sözleşme', probability: 80 },
  { title: 'Sunucu Altyapı Desteği', amount: '45000', stage: 'Teklif', probability: 50 },
  { title: 'Yıllık Bakım Anlaşması', amount: '12000', stage: 'Kazanıldı', probability: 100 },
  { title: 'Mobil Uygulama Geliştirme', amount: '250000', stage: 'Keşif', probability: 30 },
  { title: 'Bulut Göç Projesi', amount: '85000', stage: 'Pazarlık', probability: 70 },
  { title: 'SEO ve Pazarlama', amount: '18000', stage: 'Kaybedildi', probability: 0 },
  { title: 'E-Ticaret Platformu', amount: '120000', stage: 'Teklif', probability: 40 },
  { title: 'CRM Entegrasyonu', amount: '65000', stage: 'Sözleşme', probability: 90 },
]

const mockTasks = [
  { title: 'Ahmet Yılmaz ile tanışma toplantısı', priority: 'high', status: 'open' },
  { title: 'Kaya Tech için teklif hazırla', priority: 'medium', status: 'in-progress' },
  { title: 'Sözleşme taslağını gözden geçir', priority: 'high', status: 'open' },
  { title: 'Aylık performans raporunu gönder', priority: 'low', status: 'completed' },
  { title: 'Demir Lojistik referans kontrolü', priority: 'medium', status: 'open' },
  { title: 'Mobil uygulama analiz toplantısı', priority: 'high', status: 'in-progress' },
]

const mockTickets = [
  { subject: 'Sisteme giriş yapamıyorum', description: 'Şifre sıfırlama maili gelmiyor.', status: 'open', priority: 'high' },
  { subject: 'Rapor dışa aktarma hatası', description: 'PDF export ederken hata veriyor.', status: 'in-progress', priority: 'medium' },
  { subject: 'Fatura entegrasyonu hakkında', description: 'Yeni entegrasyon nasıl yapılır?', status: 'closed', priority: 'low' },
  { subject: 'Performans düşüklüğü', description: 'Dashboard sayfası çok yavaş yükleniyor.', status: 'open', priority: 'high' },
]

export async function seedMockData() {
  const userId = await getUserId()

  // Sadece eğer hiç data yoksa seed yapalım
  const existingContacts = await db.select().from(contacts).where(eq(contacts.userId, userId))
  if (existingContacts.length > 0) {
    return { success: false, message: 'Zaten veri bulunuyor.' }
  }

  // 1. Insert Contacts
  const insertedContacts = await db.insert(contacts).values(
    mockContacts.map(c => ({ userId, ...c }))
  ).returning()

  // 2. Insert Opportunities (randomly link to contacts)
  await db.insert(salesOpportunities).values(
    mockOpps.map((opp, i) => ({
      userId,
      contactId: insertedContacts[i % insertedContacts.length].id,
      ...opp
    }))
  )

  // 3. Insert Tasks
  await db.insert(tasks).values(
    mockTasks.map((task, i) => ({
      userId,
      relatedContactId: insertedContacts[i % insertedContacts.length].id,
      ...task
    }))
  )

  // 4. Insert Tickets
  await db.insert(supportTickets).values(
    mockTickets.map((ticket, i) => ({
      userId,
      contactId: insertedContacts[i % insertedContacts.length].id,
      ...ticket
    }))
  )

  revalidatePath('/')
  return { success: true, message: 'Demo veriler başarıyla yüklendi!' }
}
