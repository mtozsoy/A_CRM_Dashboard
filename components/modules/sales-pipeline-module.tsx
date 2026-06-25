'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DollarSign, Percent, Trash2, Edit2 } from 'lucide-react'
import {
  getSalesOpportunities,
  createSalesOpportunity,
  updateSalesOpportunity,
  deleteSalesOpportunity,
} from '@/app/actions/crm'

interface Opportunity {
  id: number
  userId: string
  contactId?: number | null
  title: string
  description?: string | null
  amount?: any
  currency: string
  stage: string
  probability: number | null
  expectedCloseDate?: string | null
  createdAt: Date
  updatedAt: Date
}

const stages = ['Aday', 'Müzakere', 'Teklif', 'Kapanış', 'Kazanıldı', 'Kaybedildi']

const getCurrencySymbol = (cur: string) => {
  switch (cur) {
    case 'EUR': return '€'
    case 'TRY': return '₺'
    case 'USD':
    default: return '$'
  }
}

export function SalesPipelineModule() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'USD',
    stage: 'Aday',
    probability: 10,
  })

  useEffect(() => {
    loadOpportunities()
  }, [])

  async function loadOpportunities() {
    setLoading(true)
    try {
      const data = await getSalesOpportunities()
      setOpportunities(data)
    } catch (error) {
      console.error('Fırsatlar yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingId) {
        await updateSalesOpportunity(editingId, formData)
      } else {
        await createSalesOpportunity(formData)
      }
      setFormData({ title: '', description: '', amount: '', currency: 'USD', stage: 'Aday', probability: 10 })
      setShowForm(false)
      setEditingId(null)
      loadOpportunities()
    } catch (error) {
      console.error('Fırsat kaydetme hatası:', error)
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Bu fırsatı silmek istediğinize emin misiniz?')) {
      try {
        await deleteSalesOpportunity(id)
        loadOpportunities()
      } catch (error) {
        console.error('Fırsat silme hatası:', error)
      }
    }
  }

  const opportunitiesByStage = stages.reduce(
    (acc, stage) => {
      acc[stage] = opportunities.filter((o) => o.stage === stage)
      return acc
    },
    {} as Record<string, Opportunity[]>,
  )

  return (
    <div className="p-8">
      <div className="max-w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Satış Pipeline</h1>
            <p className="text-muted-foreground mt-2">Satış fırsatlarınızı aşama bazında takip edin</p>
          </div>
          <Button onClick={() => {
            setEditingId(null)
            setFormData({ title: '', description: '', amount: '', currency: 'USD', stage: 'Aday', probability: 10 })
            setShowForm(!showForm)
          }}>
            {showForm && !editingId ? 'İptal' : '+ Yeni Fırsat'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Tutar</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-24 px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="TRY">TRY</option>
                    </select>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Aşama</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground">Kazanma Olasılığı</label>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-xs font-bold">
                      %{formData.probability}
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-muted rounded-full mt-4">
                    {/* Progress Fill */}
                    <div 
                      className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-150" 
                      style={{ width: `${formData.probability}%` }} 
                    />
                    {/* Thumb */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-card border-2 border-emerald-500 rounded-full shadow-md pointer-events-none transition-all duration-150" 
                      style={{ left: `calc(${formData.probability}% - 8px)` }} 
                    />
                    {/* Native Input */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.probability}
                      onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                      className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-6 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium px-1">
                    <span>%0</span>
                    <span>%50</span>
                    <span>%100</span>
                  </div>
                </div>
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
                <Button variant="outline" type="button" onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}>
                  İptal
                </Button>
                <Button type="submit">{editingId ? 'Güncelle' : 'Kaydet'}</Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Pipeline yükleniyor...</p>
          </div>
        ) : (
          <div className="flex gap-6 items-start overflow-x-auto pb-4 snap-x custom-scrollbar">
            {stages.map((stage) => {
              const getStageColor = (s: string) => {
                switch(s) {
                  case 'Aday': return 'bg-blue-500/10 text-blue-500 border-blue-500/20 dot-bg-blue-500'
                  case 'Müzakere': return 'bg-purple-500/10 text-purple-500 border-purple-500/20 dot-bg-purple-500'
                  case 'Teklif': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 dot-bg-yellow-500'
                  case 'Kapanış': return 'bg-orange-500/10 text-orange-500 border-orange-500/20 dot-bg-orange-500'
                  case 'Kazanıldı': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dot-bg-emerald-500'
                  case 'Kaybedildi': return 'bg-red-500/10 text-red-500 border-red-500/20 dot-bg-red-500'
                  default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20 dot-bg-gray-500'
                }
              }

              const colors = getStageColor(stage)
              const dotColor = colors.split(' ').find(c => c.startsWith('dot-bg-'))?.replace('dot-bg-', 'bg-') || 'bg-gray-500'

              return (
              <div key={stage} className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl p-4 min-w-[320px] w-[320px] flex flex-col h-[calc(100vh-220px)] min-h-[400px] snap-start shrink-0">
                <div className="flex items-center justify-between mb-4 shrink-0 pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <h3 className="font-semibold text-foreground">{stage}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors.split(' ').slice(0,3).join(' ')}`}>
                    {opportunitiesByStage[stage]?.length || 0}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                  {opportunitiesByStage[stage]?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-border/50 rounded-lg bg-background/50">
                       <p className="text-sm text-muted-foreground">Bu aşamada fırsat yok</p>
                    </div>
                  ) : (
                    opportunitiesByStage[stage]?.map((opp) => (
                      <div key={opp.id} className="group bg-card border border-border/50 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shrink-0 relative overflow-hidden cursor-pointer">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-foreground line-clamp-1 pr-12" title={opp.title}>{opp.title}</h4>
                          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setEditingId(opp.id);
                                setFormData({
                                  title: opp.title,
                                  description: opp.description || '',
                                  amount: opp.amount || '',
                                  currency: opp.currency || 'USD',
                                  stage: opp.stage,
                                  probability: opp.probability || 0,
                                });
                                setShowForm(true);
                              }}
                              className="text-muted-foreground hover:text-primary transition-colors p-1"
                              title="Düzenle"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(opp.id); }}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {opp.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{opp.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                          <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                            <span className="text-emerald-500 font-bold">{getCurrencySymbol(opp.currency)}</span>
                            {opp.amount ? Number(opp.amount).toLocaleString('tr-TR') : '0'}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 bg-muted rounded-md text-muted-foreground">
                            <Percent className="w-3 h-3" />
                            {opp.probability}%
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  )
}
