'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { StoreSettings } from '@/types'

const EMPTY: StoreSettings = {
  transfer_cbu: '',
  transfer_alias: '',
  transfer_holder: '',
  transfer_bank: '',
  mp_alias: '',
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .eq('id', 1)
    .single()

  if (error || !data) return EMPTY
  return {
    transfer_cbu: data.transfer_cbu ?? '',
    transfer_alias: data.transfer_alias ?? '',
    transfer_holder: data.transfer_holder ?? '',
    transfer_bank: data.transfer_bank ?? '',
    mp_alias: data.mp_alias ?? '',
  }
}

export async function updateStoreSettings(input: StoreSettings) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('store_settings')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', 1)

  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/pagos')
  return { success: true }
}
