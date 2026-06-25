# Modern CRM Dashboard

Bu proje, şirketlerin müşteri ilişkilerini, satış süreçlerini, takım görevlerini ve destek taleplerini tek bir merkezden yönetmelerini sağlayan **Modern CRM Dashboard** uygulamasıdır.

## 🚀 Özellikler

- **Gelişmiş Ana Sayfa (Dashboard):** İşletmenizin durumunu anlık metrikler ve canlı grafiklerle (Recharts) takip edin.
- **Müşteriler Modülü & 360° Profil:** Müşterilerinizi ekleyin, güncelleyin ve üzerine tıklayarak geçmiş satış fırsatlarını, görevlerini ve biletlerini tek bir yan panelde (Slide-over) görüntüleyin.
- **Satış Pipeline (Kanban):** Sürükle-bırak hissiyatı veren şık olasılık barlarıyla satış sürecini yönetin.
- **Görev Yönetimi:** Takım içi atamalar, aciliyet renk kodları (Düşük, Orta, Yüksek, Acil) ile işleri zamanında bitirin.
- **Destek Biletleri:** Müşteri şikayet ve destek taleplerini merkezi bir havuzdan öncelik sırasına göre çözün.
- **Çoklu Para Birimi:** USD, EUR ve TRY gibi farklı kurlarda satış fırsatları oluşturun.

## 💻 Teknolojiler (Tech Stack)

- **Frontend:** Next.js 15 (App Router), React, TailwindCSS, Lucide Icons, Recharts
- **Backend & Veri Tabanı:** Drizzle ORM, PostgreSQL (Neon/Supabase)
- **Kimlik Doğrulama:** Better Auth (Google OAuth & Email/Password)
- **UI Bileşenleri:** Radix UI tabanlı özel tasarımlar (Modern Glassmorphism ve Dark Mode esintili)

## 🛠️ Kurulum Adımları

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla izleyebilirsiniz:

### 1. Gereksinimler
- Bilgisayarınızda **Node.js** (v18 ve üzeri) yüklü olmalıdır.
- Boş bir **PostgreSQL** veritabanı (Örn: Neon.tech üzerinden ücretsiz açılabilir).

### 2. Projeyi Klonlayın ve Bağımlılıkları Yükleyin
```bash
git clone <repo-url>
cd crm-dashboard
npm install
```

### 3. Çevre Değişkenlerini (Environment Variables) Ayarlayın
Proje dizininde `.env` isimli bir dosya oluşturun ve içerisine aşağıdaki değişkenleri kendi verilerinizle doldurun:

```env
# Veritabanı Bağlantısı (PostgreSQL)
DATABASE_URL="postgres://user:password@host/dbname?sslmode=require"

# Better Auth İçin Gerekli Olanlar
BETTER_AUTH_SECRET="kendi_gizli_sifrenizi_yazin_ornegin_12345"
BETTER_AUTH_URL="http://localhost:3000"

# (Opsiyonel) Eğer Google ile giriş kullanılacaksa
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 4. Veritabanını Hazırlayın
Drizzle ORM kullanarak tabloları veritabanına aktarın:
```bash
npx drizzle-kit push
```

### 5. Örnek (Seed) Verileri Yükleyin
Gösterge panellerinin dolu görünmesi için hazır örnek verileri (müşteriler, görevler, biletler vb.) sisteme enjekte edin:
```bash
npm run seed:crm
npm run seed:tickets
```

### 6. Uygulamayı Başlatın
```bash
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresine giderek sistemi kullanmaya başlayabilirsiniz! 🎉
