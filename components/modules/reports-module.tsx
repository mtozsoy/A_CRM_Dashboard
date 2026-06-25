'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  getContacts,
  getSalesOpportunities,
  getTasks,
  getCampaigns,
} from '@/app/actions/crm'
import { Users, TrendingUp, CheckCircle, Target, type LucideIcon } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

export function ReportsModule() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalOpportunities: 0,
    totalTasks: 0,
    totalCampaigns: 0,
    totalValue: 0,
    completedTasks: 0,
  })
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<'summary' | 'sales' | 'tasks' | 'campaigns'>('summary')

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    setLoading(true)
    try {
      const [contacts, opportunities, tasks, campaigns] = await Promise.all([
        getContacts(),
        getSalesOpportunities(),
        getTasks(),
        getCampaigns(),
      ])

      const totalValue = opportunities.reduce((sum, opp: any) => sum + (parseFloat(opp.amount) || 0), 0)
      const completedTasks = tasks.filter((t: any) => t.status === 'completed').length

      setStats({
        totalContacts: contacts.length,
        totalOpportunities: opportunities.length,
        totalTasks: tasks.length,
        totalCampaigns: campaigns.length,
        totalValue,
        completedTasks,
      })
      setOpportunities(opportunities)
    } catch (error) {
      console.error('İstatistikler yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Raporlar & Analytics</h1>
          <p className="text-muted-foreground mt-2">İşletme performans metriklerinizi görüntüleyin</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Raporlar yükleniyor...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Toplam Müşteri"
                value={stats.totalContacts}
                icon={Users}
                color="blue"
              />
              <StatCard
                label="Satış Fırsatları"
                value={stats.totalOpportunities}
                icon={TrendingUp}
                color="green"
              />
              <StatCard
                label="Aktif Görevler"
                value={stats.totalTasks}
                icon={CheckCircle}
                color="purple"
              />
              <StatCard
                label="Kampanyalar"
                value={stats.totalCampaigns}
                icon={Target}
                color="orange"
              />
            </div>

            {/* Revenue Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-2">Toplam Fırsat Değeri</h2>
              <div className="text-4xl font-bold text-emerald-500">
                ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(stats.totalValue)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {stats.totalOpportunities} fırsattan hesaplanmış
              </p>
            </div>

            {/* Report Tabs */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex gap-4 mb-6 border-b border-border">
                {['summary', 'sales', 'tasks', 'campaigns'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedReport(tab as any)}
                    className={`pb-2 px-4 font-medium transition-colors ${
                      selectedReport === tab
                        ? 'text-foreground border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab === 'summary' && 'Özet'}
                    {tab === 'sales' && 'Satış'}
                    {tab === 'tasks' && 'Görevler'}
                    {tab === 'campaigns' && 'Kampanyalar'}
                  </button>
                ))}
              </div>

              {selectedReport === 'summary' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-2">Özet İstatistikler</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex justify-between">
                          <span>Toplam Müşteri:</span>
                          <span className="font-medium text-foreground">{stats.totalContacts}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Satış Fırsatları:</span>
                          <span className="font-medium text-foreground">{stats.totalOpportunities}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Toplam Görev Sayısı:</span>
                          <span className="font-medium text-foreground">{stats.totalTasks}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Tamamlanan Görevler:</span>
                          <span className="font-medium text-foreground">{stats.completedTasks}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Görev Tamamlanma Oranı:</span>
                          <span className="font-medium text-foreground">
                            {stats.totalTasks > 0
                              ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(1)
                              : 0}
                            %
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span>Kampanya Sayısı:</span>
                          <span className="font-medium text-foreground">{stats.totalCampaigns}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
                      <h3 className="font-semibold text-foreground mb-4 w-full">Fırsat Dağılımı</h3>
                      {opportunities.length > 0 ? (
                        <div className="w-full h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={(() => {
                                  const dist: Record<string, number> = {}
                                  opportunities.forEach(o => { dist[o.stage] = (dist[o.stage] || 0) + 1 })
                                  return Object.entries(dist).map(([name, value]) => ({ name, value }))
                                })()}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {(() => {
                                  const dist: Record<string, number> = {}
                                  opportunities.forEach(o => { dist[o.stage] = (dist[o.stage] || 0) + 1 })
                                  return Object.entries(dist).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#eab308', '#f97316', '#10b981', '#ef4444', '#64748b'][index % 7]} />
                                  ))
                                })()}
                              </Pie>
                              <RechartsTooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-4">Veri bulunamadı.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedReport === 'sales' && (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-4">Aşamalara Göre Gelir Beklentisi</h3>
                    <div className="w-full h-64">
                      {opportunities.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={(() => {
                              const dist: Record<string, number> = {}
                              opportunities.forEach(o => { 
                                dist[o.stage] = (dist[o.stage] || 0) + (parseFloat(o.amount) || 0)
                              })
                              return Object.entries(dist).map(([name, amount]) => ({ name, amount }))
                            })()}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                            <RechartsTooltip cursor={{fill: 'transparent'}} formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Tutar']} />
                            <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-muted-foreground">Veri bulunamadı.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedReport === 'tasks' && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">Görev Raporları</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Toplam Görev</span>
                      <span className="font-medium text-foreground">{stats.totalTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tamamlanan Görev</span>
                      <span className="font-medium text-foreground text-green-600">{stats.completedTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Devam Eden Görev</span>
                      <span className="font-medium text-foreground text-orange-600">
                        {stats.totalTasks - stats.completedTasks}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedReport === 'campaigns' && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">Kampanya Raporları</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Toplam Kampanya</span>
                      <span className="font-medium text-foreground">{stats.totalCampaigns}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Kampanya detaylarını görmek için Kampanyalar sekmesini ziyaret edin.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button onClick={loadStats} variant="outline">
              Raporları Yenile
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'orange'
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const bgColors = {
    blue: 'bg-blue-500/10',
    green: 'bg-green-500/10',
    purple: 'bg-purple-500/10',
    orange: 'bg-orange-500/10',
  }

  const borderColors = {
    blue: 'border-blue-500/20',
    green: 'border-green-500/20',
    purple: 'border-purple-500/20',
    orange: 'border-orange-500/20',
  }

  const iconColors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
  }

  return (
    <div className={`${bgColors[color]} border ${borderColors[color]} rounded-xl p-6 shadow-sm backdrop-blur-sm`}>
      <div className={`mb-4 ${iconColors[color]}`}>
        <Icon className="w-8 h-8" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
    </div>
  )
}
