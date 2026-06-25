import { config } from 'dotenv'
config({ path: '.env' })

import { db } from '../lib/db'
import {
  user,
  contacts,
  salesOpportunities,
  tasks,
  campaigns,
  supportTickets,
} from '../lib/db/schema'

async function seed() {
  console.log('Seeding CRM data...')

  // 1. Get the first user ID
  const users = await db.select().from(user).limit(1)
  if (users.length === 0) {
    console.error('No users found in the database. Please log in first to create a user.')
    process.exit(1)
  }
  const userId = users[0].id
  console.log(`Using userId: ${userId}`)

  // 2. Insert Contacts
  const insertedContacts = await db.insert(contacts).values([
    {
      userId,
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet.yilmaz@acme.com.tr',
      phone: '0532 111 22 33',
      company: 'Acme A.Ş.',
      jobTitle: 'CTO',
      industry: 'Yazılım',
      status: 'active',
      rating: 5,
    },
    {
      userId,
      firstName: 'Ayşe',
      lastName: 'Demir',
      email: 'ayse.demir@xyzlojistik.com',
      phone: '0533 222 33 44',
      company: 'XYZ Lojistik',
      jobTitle: 'Operasyon Müdürü',
      industry: 'Lojistik',
      status: 'active',
      rating: 4,
    },
    {
      userId,
      firstName: 'Can',
      lastName: 'Öztürk',
      email: 'can.ozturk@globaltech.com',
      phone: '0544 333 44 55',
      company: 'Global Tech',
      jobTitle: 'Satış Direktörü',
      industry: 'Bilişim',
      status: 'active',
      rating: 3,
    },
    {
      userId,
      firstName: 'Zeynep',
      lastName: 'Kaya',
      email: 'zeynep.kaya@eticaretx.com',
      phone: '0555 444 55 66',
      company: 'E-Ticaret X',
      jobTitle: 'Pazarlama Yöneticisi',
      industry: 'E-ticaret',
      status: 'active',
      rating: 5,
    },
  ]).returning()
  console.log(`Inserted ${insertedContacts.length} contacts.`)

  // 3. Insert Sales Opportunities
  await db.insert(salesOpportunities).values([
    {
      userId,
      contactId: insertedContacts[0].id,
      title: 'Acme A.Ş. Yeni Kurumsal Web Sitesi',
      description: 'Mevcut altyapının Next.js ile yenilenmesi projesi.',
      amount: '125000',
      stage: 'Teklif',
      probability: 60,
      expectedCloseDate: '2026-08-15',
    },
    {
      userId,
      contactId: insertedContacts[1].id,
      title: 'XYZ Lojistik Rota Optimizasyonu Yazılımı',
      description: 'Yapay zeka destekli özel lojistik algoritması geliştirmesi.',
      amount: '450000',
      stage: 'Müzakere',
      probability: 40,
      expectedCloseDate: '2026-09-01',
    },
    {
      userId,
      contactId: insertedContacts[2].id,
      title: 'Global Tech Bulut Göçü',
      description: 'On-premise sunucuların AWS altyapısına taşınması.',
      amount: '320000',
      stage: 'Aday',
      probability: 10,
      expectedCloseDate: '2026-10-15',
    },
    {
      userId,
      contactId: insertedContacts[3].id,
      title: 'E-Ticaret X CRM Entegrasyonu',
      description: 'Mevcut e-ticaret altyapısı için Salesforce entegrasyonu.',
      amount: '85000',
      stage: 'Kazanıldı',
      probability: 100,
      expectedCloseDate: '2026-06-20',
    },
    {
      userId,
      title: 'Büyük Ölçekli ERP Danışmanlığı',
      description: 'Üretim sektörü için ERP sistemleri danışmanlık hizmeti.',
      amount: '950000',
      stage: 'Aday',
      probability: 5,
    },
    {
      userId,
      title: 'Mobil Uygulama Geliştirme',
      description: 'Yeni bir fintech girişimi için React Native uygulaması.',
      amount: '210000',
      stage: 'Kapanış',
      probability: 90,
    },
    {
      userId,
      title: 'Sunucu Bakım Anlaşması',
      description: 'Yıllık sunucu yönetim ve bakım hizmetleri.',
      amount: '45000',
      stage: 'Kaybedildi',
      probability: 0,
    }
  ])
  console.log(`Inserted sales opportunities.`)

  // 4. Insert Tasks
  await db.insert(tasks).values([
    {
      userId,
      title: 'Acme A.Ş. Teklif Sunumu',
      description: 'Zoom üzerinden yapılacak sunum için hazırlık.',
      priority: 'high',
      status: 'open',
    },
    {
      userId,
      title: 'Zeynep Hanım\'ı Ara (E-ticaret X)',
      description: 'Projeyle ilgili son durum değerlendirmesi.',
      priority: 'medium',
      status: 'open',
    },
    {
      userId,
      title: 'Aylık Satış Raporunu Hazırla',
      description: 'Yönetim kuruluna sunulacak aylık özet.',
      priority: 'low',
      status: 'closed',
    }
  ])
  console.log(`Inserted tasks.`)

  // 5. Insert Campaigns
  await db.insert(campaigns).values([
    {
      userId,
      name: '2026 Q3 Dijital Pazarlama Lansmanı',
      description: 'Yeni ürünler için Facebook, Instagram ve Google Ads kampanyaları.',
      status: 'active',
      startDate: '2026-07-01',
      endDate: '2026-09-30',
      budget: '150000',
      targetAudience: 'KOBİ\'ler ve Kurumsal Firmalar',
    },
    {
      userId,
      name: 'E-posta Bülteni: Yapay Zeka Çözümleri',
      description: 'Mevcut müşteri veri tabanına yönelik bilgilendirici e-posta zinciri.',
      status: 'draft',
      budget: '5000',
      targetAudience: 'Mevcut Müşteriler',
    }
  ])
  console.log(`Inserted campaigns.`)

  // 6. Insert Support Tickets
  await db.insert(supportTickets).values([
    {
      userId,
      contactId: insertedContacts[0].id,
      subject: 'Sisteme giriş yapılamıyor',
      description: 'Acme A.Ş. kullanıcıları yeni panele giriş yaparken 500 hatası alıyor. Lütfen acil destek.',
      status: 'open',
      priority: 'urgent',
    },
    {
      userId,
      contactId: insertedContacts[1].id,
      subject: 'Fatura entegrasyonu problemi',
      description: 'XYZ Lojistik muhasebe yazılımıyla olan API entegrasyonunda zaman aşımı hataları alıyoruz.',
      status: 'in-progress',
      priority: 'high',
    },
    {
      userId,
      subject: 'Yeni kullanıcı eğitim talebi',
      description: 'Ekibimize yeni katılan 5 kişi için panel eğitim oturumu düzenlenmesini rica ediyoruz.',
      status: 'resolved',
      priority: 'medium',
    }
  ])
  console.log(`Inserted support tickets.`)

  console.log('CRM seeding completed successfully!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Failed to seed:', err)
  process.exit(1)
})
