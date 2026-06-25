import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

const github = createOpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Vercel AI SDK v3 ile gelen "parts" dizisini arka plan için düz metne (content) çeviriyoruz
  const formattedMessages = messages.map((m: any) => {
    if (m.parts && m.parts.length > 0 && m.parts[0].type === 'text') {
      return { role: m.role, content: m.parts[0].text };
    }
    if (!m.content && m.parts) {
      return { role: m.role, content: m.parts.map((p: any) => p.text).join('') };
    }
    return m;
  });

  const systemPrompt = `Sen bu CRM (Müşteri İlişkileri Yönetimi) sisteminin akıllı ve yardımsever bir yapay zeka asistanısın.
Adın: "CRM Asistanı".
Görevin, uygulamayı kullanan acemi kullanıcılara yardımcı olmaktır.
Bu CRM'in temel özellikleri şunlardır:
1. Ana Sayfa: Temel finans ve CRM metriklerinin olduğu yönetim paneli.
2. Müşteriler Modülü: Müşteri eklenebilir, düzenlenebilir. Müşteriye tıklandığında sağdan 360 derece profil penceresi açılır.
3. Satış Pipeline: Kanban tahtası şeklindedir. Fırsatlar aşamalar arasında sürüklenebilir. Kazanıldı, Kaybedildi yapılabilir.
4. Görevler: Atanan görevler, düşük/orta/yüksek/acil olarak önceliklendirilir.
5. Takvim ve Kampanyalar: Pazarlama kampanyaları ve toplantılar yönetilir.
6. Raporlar: Satış grafikleri gösterilir.
7. Destek (Tickets): Gelen şikayet ve destek biletleri yönetilir.
8. Finans & Kasa Yönetimi: Banka ve Kasa hesapları eklenebilir. Gelir, gider eklenebilir. Toplam Varlıklar anlık gösterilir, seçilen para birimine (TRY, USD, EUR) göre çevrilir.

Kullanıcı sana uygulamanın nasıl kullanılacağını sorduğunda her zaman çok kibar, kısa, net, açıklayıcı ve basit bir dille yanıt ver. Soruya doğrudan cevap ver. Gerekirse sol menüyü işaret et. Asla teknik konularda uzun karmaşık kodlar verme, her zaman son kullanıcıya hitap et.`

  const result = streamText({
    model: github.chat('gpt-4o-mini'),
    system: systemPrompt,
    messages: formattedMessages,
  });

  return result.toUIMessageStreamResponse();
}
