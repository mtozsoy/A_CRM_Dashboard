'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getSupportTickets, createSupportTicket, updateSupportTicket, deleteSupportTicket } from '@/app/actions/crm'
import { Headset, AlertCircle, Clock, CheckCircle2, Ticket } from 'lucide-react'

interface SupportTicket {
  id: number
  userId: string
  contactId?: number | null
  subject: string
  description: string
  status: string
  priority: string
  createdAt: Date
  updatedAt: Date
}

const priorities = ['low', 'medium', 'high', 'urgent']
const statuses = ['open', 'in-progress', 'resolved', 'closed']

const statusLabels: Record<string, string> = {
  'open': 'Açık',
  'in-progress': 'İşlemde',
  'resolved': 'Çözüldü',
  'closed': 'Kapatıldı',
}

const priorityLabels: Record<string, string> = {
  'low': 'Düşük',
  'medium': 'Orta',
  'high': 'Yüksek',
  'urgent': 'Acil',
}

const priorityColors: Record<string, string> = {
  'low': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'medium': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  'high': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'urgent': 'bg-red-500/10 text-red-500 border-red-500/20',
}

const statusIcons: Record<string, any> = {
  'open': <AlertCircle className="w-4 h-4 text-blue-500" />,
  'in-progress': <Clock className="w-4 h-4 text-orange-500" />,
  'resolved': <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  'closed': <Ticket className="w-4 h-4 text-muted-foreground" />,
}

export function TicketsModule() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    status: 'open',
  })

  useEffect(() => {
    loadTickets()
  }, [])

  async function loadTickets() {
    setLoading(true)
    try {
      const data = await getSupportTickets()
      setTickets(data)
    } catch (error) {
      console.error('Biletler yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createSupportTicket(formData)
      setFormData({ subject: '', description: '', priority: 'medium', status: 'open' })
      setShowForm(false)
      loadTickets()
    } catch (error) {
      console.error('Bilet kaydetme hatası:', error)
    }
  }

  async function handleStatusChange(id: number, newStatus: string) {
    try {
      await updateSupportTicket(id, { status: newStatus })
      loadTickets()
    } catch (error) {
      console.error('Bilet güncelleme hatası:', error)
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Bu destek biletini silmek istediğinize emin misiniz?')) {
      try {
        await deleteSupportTicket(id)
        loadTickets()
      } catch (error) {
        console.error('Bilet silme hatası:', error)
      }
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Headset className="w-6 h-6 text-indigo-500" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Destek Biletleri</h1>
            </div>
            <p className="text-muted-foreground mt-2">Müşteri taleplerini, sorunlarını ve şikayetlerini yönetin</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'İptal' : '+ Yeni Bilet'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Konu / Başlık *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Öncelik Durumu</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {priorityLabels[p]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Durum</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    {statuses.map((p) => (
                      <option key={p} value={p}>
                        {statusLabels[p]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Talep/Şikayet Açıklaması</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  İptal
                </Button>
                <Button type="submit">Bileti Oluştur</Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Biletler yükleniyor...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-xl shadow-sm">
            <Headset className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">Henüz oluşturulmuş bir destek bileti yok</p>
            <Button onClick={() => setShowForm(true)}>İlk Bileti Oluştur</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-md border border-border text-xs font-medium">
                        {statusIcons[ticket.status]}
                        <span className="text-foreground">{statusLabels[ticket.status]}</span>
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">{ticket.subject}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${priorityColors[ticket.priority]}`}>
                        {priorityLabels[ticket.priority]}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto pr-4">
                        {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 pr-12">
                      {ticket.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      className="px-3 py-1.5 border border-border rounded-md bg-background text-sm font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          Durum: {statusLabels[s]}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className="text-xs font-medium text-destructive hover:underline px-1"
                    >
                      Bileti Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
