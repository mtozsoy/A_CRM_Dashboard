'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getContactProfile } from '@/app/actions/crm'
import { X, UserCircle2, Briefcase, Mail, Phone, Clock, Target, TrendingUp, Headset, Calendar } from 'lucide-react'

interface ContactProfilePanelProps {
  contactId: number
  onClose: () => void
}

export function ContactProfilePanel({ contactId, onClose }: ContactProfilePanelProps) {
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'opportunities' | 'tasks' | 'tickets'>('opportunities')

  useEffect(() => {
    loadProfile()
  }, [contactId])

  async function loadProfile() {
    setLoading(true)
    try {
      const data = await getContactProfile(contactId)
      setProfileData(data)
    } catch (error) {
      console.error('Profil yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-background border-l border-border shadow-2xl z-50 flex items-center justify-center">
        <div className="text-muted-foreground">Profil yükleniyor...</div>
      </div>
    )
  }

  if (!profileData || !profileData.contact) {
    return null
  }

  const { contact, opportunities, tasks, tickets } = profileData

  return (
    <>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-card border-l border-border shadow-2xl z-50 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="p-6 border-b border-border bg-muted/20 sticky top-0 z-10 flex justify-between items-start backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <UserCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {contact.firstName} {contact.lastName}
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Briefcase className="w-4 h-4" />
                <span>{contact.jobTitle || 'Unvan Yok'} - {contact.company || 'Şirket Yok'}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                {contact.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${contact.phone}`} className="text-primary hover:underline">{contact.phone}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex px-6 border-b border-border bg-muted/10 sticky top-[112px] z-10">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'opportunities' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Fırsatlar ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tasks' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Görevler ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tickets' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Destek ({tickets.length})
          </button>
        </div>

        <div className="p-6 flex-1">
          {activeTab === 'opportunities' && (
            <div className="space-y-4">
              {opportunities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Bağlı fırsat bulunamadı.</div>
              ) : (
                opportunities.map((opp: any) => (
                  <div key={opp.id} className="p-4 border border-border rounded-xl bg-background hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <h4 className="font-semibold">{opp.title}</h4>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 bg-muted rounded-full">{opp.stage}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{opp.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{opp.amount ? `${opp.amount} ${opp.currency}` : '-'}</span>
                      <span className="text-muted-foreground text-xs">{new Date(opp.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Bağlı görev bulunamadı.</div>
              ) : (
                tasks.map((task: any) => (
                  <div key={task.id} className="p-4 border border-border rounded-xl bg-background hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <h4 className="font-semibold">{task.title}</h4>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 bg-muted rounded-full">{task.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    {task.dueDate && (
                      <div className="text-xs text-muted-foreground">
                        Bitiş: {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Destek talebi bulunamadı.</div>
              ) : (
                tickets.map((ticket: any) => (
                  <div key={ticket.id} className="p-4 border border-border rounded-xl bg-background hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Headset className="w-4 h-4 text-indigo-500" />
                        <h4 className="font-semibold">{ticket.subject}</h4>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 bg-muted rounded-full">{ticket.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{ticket.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-xs px-2 py-0.5 border border-border rounded-full">{ticket.priority}</span>
                      <span className="text-muted-foreground text-xs">{new Date(ticket.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </>
  )
}
