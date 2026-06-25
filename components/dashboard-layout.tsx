'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { ContactsModule } from '@/components/modules/contacts-module'
import { SalesPipelineModule } from '@/components/modules/sales-pipeline-module'
import { TasksModule } from '@/components/modules/tasks-module'
import { CampaignsModule } from '@/components/modules/campaigns-module'
import { CalendarModule } from '@/components/modules/calendar-module'
import { ReportsModule } from '@/components/modules/reports-module'
import { TicketsModule } from '@/components/modules/tickets-module'
import { Users, TrendingUp, CheckSquare, Target, Calendar, BarChart3, Headset, CircleDollarSign } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getDashboardStats } from '@/app/actions/crm'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type ModuleType = 'contacts' | 'sales' | 'tasks' | 'campaigns' | 'calendar' | 'reports' | 'tickets' | 'home'

interface DashboardLayoutProps {
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

export function DashboardLayout({ user }: DashboardLayoutProps) {
  const [activeModule, setActiveModule] = useState<ModuleType>('home')

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={user} onModuleChange={setActiveModule} />
        <main className="flex-1 overflow-auto">
          {activeModule === 'home' && <HomeModule onModuleChange={setActiveModule} />}
          {activeModule === 'contacts' && <ContactsModule />}
          {activeModule === 'sales' && <SalesPipelineModule />}
          {activeModule === 'tasks' && <TasksModule />}
          {activeModule === 'campaigns' && <CampaignsModule />}
          {activeModule === 'calendar' && <CalendarModule />}
          {activeModule === 'reports' && <ReportsModule />}
          {activeModule === 'tickets' && <TicketsModule />}
        </main>
      </div>
    </div>
  )
}

function HomeModule({ onModuleChange }: { onModuleChange: (module: ModuleType) => void }) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const data = await getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Stats loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">CRM Dashboard&apos;a Hoş Geldiniz </h1>
        <p className="text-muted-foreground mb-8">
          İşletmenizin güncel durumunu tek bakışta inceleyin.
        </p>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Veriler yükleniyor...</div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard title="Toplam Pipeline" value={`${new Intl.NumberFormat('tr-TR').format(stats.metrics.totalPipelineValue)}`} icon={CircleDollarSign} trend="+12%" onClick={() => onModuleChange('sales')} />
              <MetricCard title="Aktif Müşteriler" value={stats.metrics.totalContacts} icon={Users} trend="+5" onClick={() => onModuleChange('contacts')} />
              <MetricCard title="Bekleyen Görevler" value={stats.metrics.activeTasks} icon={CheckSquare} trend="-2" onClick={() => onModuleChange('tasks')} />
              <MetricCard title="Açık Destek Biletleri" value={stats.metrics.openTickets} icon={Headset} trend="+1" onClick={() => onModuleChange('tickets')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Aşamalara Göre Fırsatlar</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.charts.pipeline}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                      <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold mb-6">Görev Durumları</h3>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.charts.tasks}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.charts.tasks.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        ) : null}

        <h3 className="text-xl font-bold mb-4">Hızlı Erişim</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard title="Müşteriler" description="Müşterileri yönetin" icon={Users} onClick={() => onModuleChange('contacts')} />
          <DashboardCard title="Satış Pipeline" description="Fırsatları takip edin" icon={TrendingUp} onClick={() => onModuleChange('sales')} />
          <DashboardCard title="Kampanyalar" description="Pazarlama yönetimi" icon={Target} onClick={() => onModuleChange('campaigns')} />
          <DashboardCard title="Raporlar" description="Performans analizi" icon={BarChart3} onClick={() => onModuleChange('reports')} />
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, trend, onClick }: { title: string, value: string | number, icon: LucideIcon, trend: string, onClick?: () => void }) {
  const isPositive = trend.startsWith('+')
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full bg-card border border-border rounded-xl p-6 shadow-sm flex items-center justify-between hover:shadow-md hover:border-primary/40 transition-all"
    >
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-foreground">{value}</h4>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-xs font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
    </button>
  )
}

interface CardProps {
  title: string
  description: string
  icon: LucideIcon
  onClick: () => void
}

function DashboardCard({ title, description, icon: Icon, onClick }: CardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-card border border-border rounded-lg p-6 hover:shadow-md hover:border-primary/40 transition-all"
    >
      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
        <Icon className="size-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  )
}
