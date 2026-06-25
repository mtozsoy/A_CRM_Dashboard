'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Home, Users, TrendingUp, CheckSquare, Target, Calendar, BarChart3, LogOut, Headset, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ModuleType = 'contacts' | 'sales' | 'tasks' | 'campaigns' | 'calendar' | 'reports' | 'tickets' | 'finance' | 'home'

interface MenuItem {
  id: ModuleType
  label: string
  icon: LucideIcon
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Ana Sayfa', icon: Home },
  { id: 'contacts', label: 'Müşteriler', icon: Users },
  { id: 'sales', label: 'Satış Pipeline', icon: TrendingUp },
  { id: 'tasks', label: 'Görevler', icon: CheckSquare },
  { id: 'campaigns', label: 'Kampanyalar', icon: Target },
  { id: 'calendar', label: 'Takvim', icon: Calendar },
  { id: 'reports', label: 'Raporlar', icon: BarChart3 },
  { id: 'tickets', label: 'Destek', icon: Headset },
  { id: 'finance', label: 'Finans', icon: Wallet },
]

interface DashboardSidebarProps {
  activeModule: ModuleType
  onModuleChange: (module: ModuleType) => void
}

export function DashboardSidebar({ activeModule, onModuleChange }: DashboardSidebarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/sign-in')
  }

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">CRM</h1>
        <p className="text-sm text-muted-foreground">Dashboard</p>
      </div>

      <nav className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeModule === item.id ? 'default' : 'ghost'}
                className="w-full justify-start text-base"
                onClick={() => onModuleChange(item.id)}
              >
                <Icon data-icon="inline-start" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut data-icon="inline-start" />
          Çıkış Yap
        </Button>
      </div>
    </aside>
  )
}
