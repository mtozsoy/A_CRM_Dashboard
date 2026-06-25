'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getTasks, createTask, updateTask, deleteTask } from '@/app/actions/crm'

interface Task {
  id: number
  userId: string
  title: string
  description?: string | null
  dueDate?: Date | null
  priority: string
  status: string
  relatedContactId?: number | null
  relatedOpportunityId?: number | null
  createdAt: Date
  updatedAt: Date
}

const priorities = ['düşük', 'orta', 'yüksek', 'acil']
const statuses = ['açık', 'devam ediyor', 'tamamlandı', 'iptal edildi']

export function TasksModule() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'orta',
    status: 'açık',
  })

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    setLoading(true)
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (error) {
      console.error('Görevler yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createTask(formData)
      setFormData({ title: '', description: '', dueDate: '', priority: 'orta', status: 'açık' })
      setShowForm(false)
      loadTasks()
    } catch (error) {
      console.error('Görev kaydetme hatası:', error)
    }
  }

  async function handleStatusChange(id: number, newStatus: string) {
    try {
      await updateTask(id, { status: newStatus })
      loadTasks()
    } catch (error) {
      console.error('Görev güncelleme hatası:', error)
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Bu görevi silmek istediğinize emin misiniz?')) {
      try {
        await deleteTask(id)
        loadTasks()
      } catch (error) {
        console.error('Görev silme hatası:', error)
      }
    }
  }

  const tasksByStatus = statuses.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  const statusLabels: Record<string, string> = {
    'açık': 'Açık',
    'devam ediyor': 'Devam Ediyor',
    'tamamlandı': 'Tamamlandı',
    'iptal edildi': 'İptal Edildi',
  }

  const priorityLabels: Record<string, string> = {
    'düşük': 'Düşük',
    'orta': 'Orta',
    'yüksek': 'Yüksek',
    'acil': 'Acil',
    'low': 'Düşük',
    'medium': 'Orta',
    'high': 'Yüksek',
    'urgent': 'Acil',
  }

  const priorityColors: Record<string, string> = {
    'düşük': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'orta': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'yüksek': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'acil': 'bg-red-500/10 text-red-500 border-red-500/20',
    'low': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'medium': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'high': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'urgent': 'bg-red-500/10 text-red-500 border-red-500/20',
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Görevler</h1>
            <p className="text-muted-foreground mt-2">Yapılması gereken görevleri yönetin</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'İptal' : '+ Yeni Görev'}
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
                  <label className="block text-sm font-medium text-foreground mb-2">Öncelik</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Süre</label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  />
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
            <p className="text-muted-foreground">Görevler yükleniyor...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground mb-4">Henüz görev eklenmedi</p>
            <Button onClick={() => setShowForm(true)}>İlk Görevi Ekle</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{task.title}</h3>
                      <span className={`px-2.5 py-0.5 border rounded-full text-xs font-bold ${priorityColors[task.priority] || 'bg-muted text-foreground border-border'}`}>
                        {priorityLabels[task.priority] || task.priority}
                      </span>
                      <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium text-foreground">
                        {statusLabels[task.status]}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-2">{task.description}</p>
                    )}
                    {task.dueDate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Süre: {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="px-3 py-1 border border-border rounded-md bg-background text-sm"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {statusLabels[s]}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Sil
                    </Button>
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
