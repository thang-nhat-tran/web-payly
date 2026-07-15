import { supabase } from '@/shared/lib/supabase'
import { uploadFile, getPrivateFileUrl } from '@/shared/lib/storage/core/storage.service'
import { buildSettlementEvidencePath } from '@/shared/lib/storage/core/file-path-builder'
import type { QueryData } from '@supabase/supabase-js'
import type { Settlement, SettlementDetail } from '@/modules/settlement/types/settlement.type'

const SETTLEMENT_SELECT = `id, group_id, amount, title, note, settled_at, evidence_image_path, to_user,
   payee:users!settlements_to_user_fkey ( id, full_name, avatar_url )` as const

const SETTLEMENT_DETAIL_SELECT = `${SETTLEMENT_SELECT},
   expense_splits ( id, share_amount, expenses!inner ( id, title, created_at ) )` as const

/** Settlements the current user made ("Đã thanh toán") in a group, newest first. */
function settlementListQuery(groupId: string, userId: string) {
  return supabase
    .from('settlements')
    .select(SETTLEMENT_SELECT)
    .eq('group_id', groupId)
    .eq('from_user', userId)
    .order('settled_at', { ascending: false })
}
type SettlementRow = QueryData<ReturnType<typeof settlementListQuery>>[number]

/** A single settlement with the expense splits it paid off. */
function settlementDetailQuery(settlementId: string) {
  return supabase.from('settlements').select(SETTLEMENT_DETAIL_SELECT).eq('id', settlementId).maybeSingle()
}
type SettlementDetailRow = NonNullable<QueryData<ReturnType<typeof settlementDetailQuery>>>

/** Maps a raw settlement row to the `Settlement` domain model. */
function mapSettlement(row: SettlementRow): Settlement {
  return {
    id: row.id,
    groupId: row.group_id,
    amount: row.amount,
    title: row.title,
    note: row.note,
    settledAt: row.settled_at,
    evidenceImagePath: row.evidence_image_path,
    to: {
      id: row.payee?.id ?? row.to_user,
      name: row.payee?.full_name ?? '',
      avatarUrl: row.payee?.avatar_url ?? null,
    },
  }
}

/** Maps a raw settlement-detail row to the `SettlementDetail` domain model. */
function mapSettlementDetail(row: SettlementDetailRow): SettlementDetail {
  return {
    ...mapSettlement(row),
    splits: row.expense_splits.map((split) => ({
      id: split.id,
      shareAmount: split.share_amount,
      expenseId: split.expenses.id,
      expenseTitle: split.expenses.title,
      expenseCreatedAt: split.expenses.created_at ?? '',
    })),
  }
}

export const settlementApi = {
  /** Fetches the current user's "Đã thanh toán" — settlements they made in a group. */
  async fetchSettlements(groupId: string, userId: string): Promise<Settlement[]> {
    const { data, error } = await settlementListQuery(groupId, userId)
    if (error) throw error
    return data.map(mapSettlement)
  },

  /** Fetches one settlement with the expense splits it paid off, or null if it doesn't exist. */
  async fetchSettlementDetail(settlementId: string): Promise<SettlementDetail | null> {
    const { data, error } = await settlementDetailQuery(settlementId)
    if (error) throw error
    return data ? mapSettlementDetail(data) : null
  },

  /** Resolves a settlement evidence path to a short-lived, viewable signed URL. */
  getEvidenceImageUrl(path: string): Promise<string> {
    return getPrivateFileUrl('settlementEvidence', path)
  },

  /**
   * Marks one or more of the current user's `expense_splits` as settled via
   * the `settle_expense_splits` Postgres function.
   * @param evidenceImagePath Storage path of an uploaded payment-proof image (see
   * `uploadSettlementEvidence`), stored on every `settlements` row this call creates.
   * @returns the ids of the `settlements` rows created (one per distinct payer).
   */
  async settleDebts(splitIds: string[], evidenceImagePath?: string): Promise<string[]> {
    const { data, error } = await supabase.rpc('settle_expense_splits', {
      p_expense_split_ids: splitIds,
      p_evidence_image_path: evidenceImagePath,
    })
    if (error) throw error
    return data
  },

  /**
   * Uploads a payment-proof image for the current user's next settlement, grouped
   * under their own folder since the settlement itself doesn't exist until
   * `settleDebts` runs.
   * @returns the storage path to pass into `settleDebts` as `evidenceImagePath`
   * (private-bucket paths, not URLs — resolve with `getPrivateFileUrl` to display).
   */
  async uploadSettlementEvidence(userId: string, file: File): Promise<string> {
    const { path } = await uploadFile(file, buildSettlementEvidencePath(userId, file), 'settlementEvidence')
    return path
  },
}
