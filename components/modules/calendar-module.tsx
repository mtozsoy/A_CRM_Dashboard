'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getCalendarEvents, createCalendarEvent, deleteCalendarEvent } from '@/app/actions/crm'

interface CalendarEvent {
  id: number
  userId: string
  title: string
  description?: string | null
  startTime: Date | string
  endTime: Date | string
  eventType?: string | null
  relatedContactId?: number | null
  relatedOpportunityId?: number | null
  createdAt: Date
  updatedAt: Date
}

export function CalendarModule() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    eventType: 'toplantı',
  })

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    setLoading(true)
    try {
      const data = await getCalendarEvents()
      setEvents(data)
    } catch (error) {
      console.error('Etkinlikler yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createCalendarEvent(formData)
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        eventType: 'toplantı',
      })
      setShowForm(false)
      loadEvents()
    } catch (error) {
      console.error('Etkinlik kaydetme hatası:', error)
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
      try {
        await deleteCalendarEvent(id)
        loadEvents()
      } catch (error) {
        console.error('Etkinlik silme hatası:', error)
      }
    }
  }

  const eventTypes: Record<string, string> = {
    'toplantı': 'Toplantı',
    'telefon görüşmesi': 'Telefon Görüşmesi',
    'e-posta': 'E-posta',
    'görev': 'Görev',
    'diğer': 'Diğer',
  }

  const upcomingEvents = events
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .filter((e) => new Date(e.startTime) > new Date())

  const pastEvents = events
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .filter((e) => new Date(e.startTime) <= new Date())

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Takvim</h1>
            <p className="text-muted-foreground mt-2">Toplantıları ve etkinlikleri planlayın</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'İptal' : '+ Yeni Etkinlik'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Başlık *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Başlama Zamanı *</label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bitiş Zamanı *</label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Etkinlik Türü</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  {Object.entries(eventTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  İptal
                </Button>
                <Button type="submit">Kaydet</Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Etkinlikler yükleniyor...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Yaklaşan Etkinlikler</h2>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-foreground">{event.title}</h3>
                            {event.eventType && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                {eventTypes[event.eventType] || event.eventType}
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(event.startTime).toLocaleDateString('tr-TR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Sil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Geçmiş Etkinlikler</h2>
                <div className="space-y-3">
                  {pastEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="bg-card border border-border rounded-lg p-4 opacity-75">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{event.title}</h3>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(event.startTime).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Sil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {events.length === 0 && (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground mb-4">Henüz etkinlik eklenmedi</p>
                <Button onClick={() => setShowForm(true)}>İlk Etkinlik&apos;i Ekle</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
