'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

type ModuleType = 'contacts' | 'sales' | 'tasks' | 'campaigns' | 'calendar' | 'reports' | 'home'

interface DashboardHeaderProps {
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  onModuleChange: (module: ModuleType) => void
}

export function DashboardHeader({ user, onModuleChange }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/sign-in')
  }

  return (
    <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Hoş Geldiniz</p>
          <p className="text-lg font-semibold text-foreground">{user.name || user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Çıkış Yap
        </Button>
      </div>
    </header>
  )
}
