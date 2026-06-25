import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardLayout } from '@/components/dashboard-layout'

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const user = session?.user || {
    id: 'demo-user-id',
    name: 'Demo Kullanıcı',
    email: 'demo@crm.com',
    image: null
  }

  return <DashboardLayout user={user} />
}
