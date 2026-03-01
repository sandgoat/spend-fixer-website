/**
 * Account Deletion Endpoint — POST /api/account/delete
 *
 * Full deletion sequence (best-effort — errors are logged but not fatal):
 *
 *  1. Authenticate the requesting user via session cookie
 *  2. Fetch all PlaidItems for the user
 *  3. For each PlaidItem:
 *     a. Decrypt the stored access token (AES-256-GCM)
 *     b. Call Plaid /item/remove to unlink the item on Plaid's side
 *        (failure is tolerated — we still delete local data)
 *  4. Delete all Transactions belonging to the user
 *  5. Delete all Accounts belonging to the user
 *  6. Delete all PlaidItems belonging to the user
 *  7. Delete all Budgets belonging to the user
 *  8. Delete all Goals belonging to the user
 *  9. Delete the User record itself
 * 10. Clear the session cookie
 * 11. Return 200 OK { success: true }
 *
 * What gets purged:
 *  - User profile
 *  - All linked bank connections (PlaidItems)
 *  - All synced bank accounts (Accounts)
 *  - All transaction history (Transactions)
 *  - All budgets (Budgets)
 *  - All savings goals (Goals)
 *
 * GDPR/CCPA note: this constitutes a "right to erasure" deletion of all
 * personally identifiable data stored for the user.
 */

import { getUserFromEvent, clearAuthCookie } from '~/server/utils/auth'
import { decrypt } from '~/server/utils/encryption'

export default defineEventHandler(async (event) => {
  // Step 1: Authenticate
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const userId = user.id
  console.log(`[account/delete] Starting deletion for user ${userId}`)

  const client = getPlaidClient()

  // Step 2: Fetch all PlaidItems
  let plaidItems: { id: string; accessToken: string; itemId: string }[] = []
  try {
    plaidItems = await prisma.plaidItem.findMany({
      where: { userId },
      select: { id: true, accessToken: true, itemId: true },
    })
    console.log(`[account/delete] Found ${plaidItems.length} PlaidItem(s) to remove`)
  } catch (err) {
    console.error('[account/delete] Failed to fetch PlaidItems:', err)
  }

  // Step 3: Remove each item from Plaid
  for (const item of plaidItems) {
    try {
      const accessToken = decrypt(item.accessToken)
      await client.itemRemove({ access_token: accessToken })
      console.log(`[account/delete] Removed Plaid item ${item.itemId}`)
    } catch (err) {
      // Non-fatal: item may already be invalid or sandbox doesn't support /item/remove
      console.error(`[account/delete] Failed to remove Plaid item ${item.itemId} (continuing):`, err)
    }
  }

  // Step 4: Delete all Transactions
  try {
    const { count } = await prisma.transaction.deleteMany({ where: { userId } })
    console.log(`[account/delete] Deleted ${count} transaction(s)`)
  } catch (err) {
    console.error('[account/delete] Failed to delete Transactions:', err)
  }

  // Step 5: Delete all Accounts
  try {
    const { count } = await prisma.account.deleteMany({ where: { userId } })
    console.log(`[account/delete] Deleted ${count} account(s)`)
  } catch (err) {
    console.error('[account/delete] Failed to delete Accounts:', err)
  }

  // Step 6: Delete all PlaidItems
  try {
    const { count } = await prisma.plaidItem.deleteMany({ where: { userId } })
    console.log(`[account/delete] Deleted ${count} PlaidItem(s)`)
  } catch (err) {
    console.error('[account/delete] Failed to delete PlaidItems:', err)
  }

  // Step 7: Delete all Budgets
  try {
    const { count } = await prisma.budget.deleteMany({ where: { userId } })
    console.log(`[account/delete] Deleted ${count} budget(s)`)
  } catch (err) {
    console.error('[account/delete] Failed to delete Budgets:', err)
  }

  // Step 8: Delete all Goals
  try {
    const { count } = await prisma.goal.deleteMany({ where: { userId } })
    console.log(`[account/delete] Deleted ${count} goal(s)`)
  } catch (err) {
    console.error('[account/delete] Failed to delete Goals:', err)
  }

  // Step 9: Delete the User record
  try {
    await prisma.user.delete({ where: { id: userId } })
    console.log(`[account/delete] Deleted user record ${userId}`)
  } catch (err) {
    console.error('[account/delete] Failed to delete User record:', err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete user account' })
  }

  // Step 10: Clear session cookie
  clearAuthCookie(event)
  console.log(`[account/delete] Session cleared for user ${userId} — deletion complete`)

  // Step 11: Return success
  return { success: true }
})
