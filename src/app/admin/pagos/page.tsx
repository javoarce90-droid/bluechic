import { getStoreSettings } from '@/lib/actions/settings'
import PaymentSettingsClient from '@/components/admin/PaymentSettingsClient'

export const dynamic = 'force-dynamic'

export default async function PagosAdminPage() {
  const settings = await getStoreSettings()
  return <PaymentSettingsClient initialSettings={settings} />
}
