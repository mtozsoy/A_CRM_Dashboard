import { config } from 'dotenv'
config({ path: '.env' })

import { db } from '../lib/db'
import {
  user,
  supportTickets,
} from '../lib/db/schema'

async function seed() {
  const users = await db.select().from(user).limit(1)
  if (users.length === 0) {
    process.exit(1)
  }
  const userId = users[0].id

  await db.insert(supportTickets).values([
    {
      userId,
      subject: 'Sisteme giriş yapılamıyor',
      description: 'Acme A.Ş. kullanıcıları yeni panele giriş yaparken 500 hatası alıyor. Lütfen acil destek.',
      status: 'open',
      priority: 'urgent',
    },
    {
      userId,
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
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
