# Modern CRM Dashboard

Bu proje, şirketlerin müşteri ilişkilerini, satış süreçlerini, takım görevlerini, destek taleplerini ve finansal varlıklarını tek bir merkezden yönetmelerini sağlayan **Modern CRM Dashboard** uygulamasıdır.

## 🚀 Özellikler

- **Gelişmiş Ana Sayfa (Dashboard):** İşletmenizin durumunu anlık metrikler ve canlı grafiklerle (Recharts) takip edin. Tıklanabilir akıllı özet kartları ile detaylara hızlıca geçiş yapın.
- **Yapay Zeka (AI) Asistanı:** Yeni kullanıcıların sistemi kolayca öğrenmesi ve kullanması için Vercel AI SDK ve GitHub Models altyapısıyla çalışan, sayfanın sağ alt köşesinde yer alan akıllı bir CRM Asistanı.
- **Finans ve Kasa Yönetimi:** Banka hesaplarını, kasaları ve tüm finansal işlemleri (gelir/gider) yönetin. TRY, USD, EUR kurlarında canlı varlık hesaplaması ve toplam bakiye çevirisi.
- **Müşteriler Modülü & 360° Profil:** Müşterilerinizi ekleyin, güncelleyin ve üzerine tıklayarak geçmiş satış fırsatlarını, görevlerini ve biletlerini tek bir yan panelde (Slide-over) görüntüleyin.
- **Satış Pipeline (Kanban):** Sürükle-bırak hissiyatı veren şık olasılık barlarıyla satış sürecini yönetin.
- **Görev Yönetimi:** Takım içi atamalar, aciliyet renk kodları (Düşük, Orta, Yüksek, Acil) ile işleri zamanında bitirin.
- **Destek Biletleri:** Müşteri şikayet ve destek taleplerini merkezi bir havuzdan öncelik sırasına göre çözün.

## 💻 Teknolojiler (Tech Stack)

- **Frontend:** Next.js 16 (App Router, Turbopack), React 19, TailwindCSS 4, Lucide Icons, Recharts
- **Backend & Veri Tabanı:** Drizzle ORM, PostgreSQL (Neon/Supabase)
- **Kimlik Doğrulama:** Better Auth (Google OAuth & Email/Password)
- **Yapay Zeka:** Vercel AI SDK (`ai`, `@ai-sdk/openai`), GitHub Models (Azure OpenAI tabanlı)
- **UI Bileşenleri:** Shadcn UI ve Radix UI tabanlı özel tasarımlar (Modern Glassmorphism ve Dark Mode uyumlu)

## 🛠️ Kurulum Adımları

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla izleyebilirsiniz:

### 1. Gereksinimler
- Bilgisayarınızda **Node.js** (v18 ve üzeri) yüklü olmalıdır.
- Boş bir **PostgreSQL** veritabanı (Örn: Neon.tech üzerinden ücretsiz açılabilir).
- **GitHub Personal Access Token (PAT)**: Yapay Zeka modellerini (GitHub Models) kullanabilmek için gereklidir.

### 2. Projeyi Klonlayın ve Bağımlılıkları Yükleyin
```bash
git clone https://github.com/mtozsoy/A_CRM_Dashboard.git
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
BETTER_AUTH_TRUSTED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000" # Ağ üzerinden erişim için kendi IP'nizi ekleyebilirsiniz

# Yapay Zeka Asistanı İçin
OPENAI_API_KEY="github_pat_...." # GitHub Models'tan alınan token
```

### 4. Veritabanını Hazırlayın
Drizzle ORM kullanarak tabloları veritabanına aktarın:
```bash
npx drizzle-kit push
```

### 5. Uygulamayı Başlatın
```bash
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresine giderek sistemi kullanmaya başlayabilirsiniz! 🎉
