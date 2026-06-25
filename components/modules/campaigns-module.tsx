'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from '@/app/actions/crm'

interface Campaign {
  id: number
  userId: string
  name: string
  description?: string | null
  status: string
  startDate?: string | null
  endDate?: string | null
  budget?: any
  targetAudience?: string | null
  createdAt: Date
  updatedAt: Date
}

const statuses = ['taslak', 'aktif', 'duraklatıldı', 'tamamlandı']

export function CampaignsModule() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'taslak',
    startDate: '',
    endDate: '',
    budget: '',
    targetAudience: '',
  })

  useEffect(() => {
    loadCampaigns()
  }, [])

  async function loadCampaigns() {
    setLoading(true)
    try {
      const data = await getCampaigns()
      setCampaigns(data)
    } catch (error) {
      console.error('Kampanyalar yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createCampaign(formData)
      setFormData({
        name: '',
        description: '',
        status: 'taslak',
        startDate: '',
        endDate: '',
        budget: '',
        targetAudience: '',
      })
      setShowForm(false)
      loadCampaigns()
    } catch (error) {
      console.error('Kampanya kaydetme hatası:', error)
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) {
      try {
        await deleteCampaign(id)
        loadCampaigns()
      } catch (error) {
        console.error('Kampanya silme hatası:', error)
      }
    }
  }

  const statusColors: Record<string, string> = {
    'taslak': 'bg-gray-100 text-gray-800',
    'aktif': 'bg-green-100 text-green-800',
    'duraklatıldı': 'bg-yellow-100 text-yellow-800',
    'tamamlandı': 'bg-blue-100 text-blue-800',
  }

  const statusLabels: Record<string, string> = {
    'taslak': 'Taslak',
    'aktif': 'Aktif',
    'duraklatıldı': 'Duraklatıldı',
    'tamamlandı': 'Tamamlandı',
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kampanyalar</h1>
            <p className="text-muted-foreground mt-2">Pazarlama kampanyalarınızı yönetin</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'İptal' : '+ Yeni Kampanya'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Kampanya Adı *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Statü</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bütçe</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Hedef Kitle</label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
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
            <p className="text-muted-foreground">Kampanyalar yükleniyor...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground mb-4">Henüz kampanya eklenmedi</p>
            <Button onClick={() => setShowForm(true)}>İlk Kampanya&apos;yı Ekle</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{campaign.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${statusColors[campaign.status]}`}>
                      {statusLabels[campaign.status]}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(campaign.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Sil
                  </Button>
                </div>

                {campaign.description && (
                  <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                )}

                <div className="space-y-2 text-sm">
                  {campaign.budget && <p className="text-foreground">Bütçe: ${campaign.budget}</p>}
                  {campaign.startDate && (
                    <p className="text-muted-foreground">
                      Tarih: {new Date(campaign.startDate).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                  {campaign.targetAudience && (
                    <p className="text-muted-foreground">Hedef: {campaign.targetAudience}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
