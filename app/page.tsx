import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardLayout } from '@/components/dashboard-layout'

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const sessionUser = session?.user

  const user = {
    id: sessionUser?.id || 'demo-user-id',
    name: sessionUser?.name || 'Demo Kullanıcı',
    email: sessionUser?.email || 'demo@crm.com',
    image: sessionUser?.image || null
  }

  return <DashboardLayout user={user} />
}
