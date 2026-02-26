# SpendFixer — Data Retention and Disposal Policy

**Document Owner:** SpendFixer Security  
**Effective Date:** February 24, 2026  
**Last Reviewed:** February 24, 2026  
**Next Review:** August 2026  
**Classification:** Internal — Confidential

---

## 1. Purpose

This policy defines the data retention periods and disposal procedures for all consumer and business data processed by SpendFixer. It ensures compliance with applicable data privacy laws (including CCPA/CPRA and GLBA) and Plaid's developer requirements, while minimizing risk by retaining data only as long as necessary.

## 2. Scope

This policy covers all data collected, processed, or stored by SpendFixer, including:

- Consumer personal data (name, email, password hash)
- Consumer financial data (transactions, account balances, bank account metadata)
- Third-party integration data (Plaid access tokens, item IDs)
- Application data (budgets, goals, settings)
- Operational data (server logs, error logs, analytics)
- Marketing data (waitlist signups)

## 3. Data Retention Schedule

### 3.1 Consumer Data

| Data Category | Data Elements | Retention Period | Trigger for Disposal | Legal Basis |
|--------------|---------------|-----------------|---------------------|-------------|
| **Account profile** | Name, email, password hash, plan type | Duration of account + 30 days | Account deletion request or account inactivity > 24 months | Contractual necessity; legitimate interest |
| **Financial transactions** | Transaction date, merchant, amount, category, pending status | Duration of account + 30 days | Account deletion request | Contractual necessity (core service) |
| **Bank account metadata** | Account name, type, balance, institution | Duration of account + 30 days | Account deletion or bank disconnection | Contractual necessity |
| **Plaid access tokens** | Encrypted access token, item ID | Until bank disconnection or account deletion | User disconnects bank or deletes account | Contractual necessity; disposed immediately when no longer needed |
| **Plaid sync cursors** | Transaction sync cursor | Duration of Plaid connection | Bank disconnection or account deletion | Operational necessity |
| **Budgets and goals** | Category, amount, target, deadline | Duration of account + 30 days | Account deletion request | Contractual necessity |
| **User preferences** | Notification settings, category customizations | Duration of account + 30 days | Account deletion request | Contractual necessity |

### 3.2 Operational Data

| Data Category | Data Elements | Retention Period | Disposal Method |
|--------------|---------------|-----------------|----------------|
| **Application server logs** | Request method, path, status code, timestamp, user ID (no sensitive data) | 30 days | Automatic expiration by log provider |
| **Security event logs** | Authentication events, access changes, security alerts | 90 days | Automatic expiration by log provider |
| **Error logs** | Stack traces, error messages (no consumer financial data) | 30 days | Automatic expiration by log provider |
| **Access audit logs** | Provisioning/revocation records | 1 year | Manual deletion after retention period |

### 3.3 Marketing Data

| Data Category | Data Elements | Retention Period | Disposal Method |
|--------------|---------------|-----------------|----------------|
| **Waitlist signups** | Email address | Until product launch + 90 days, or until unsubscribe | Database deletion |
| **Marketing consent records** | Email, consent type, timestamp | Duration of consent + 3 years | Database deletion |

## 4. Data Disposal Procedures

### 4.1 Consumer Account Deletion

When a consumer requests account deletion (via in-app settings or email request):

**Timeline:** Completed within 30 calendar days of verified request.

**Procedure:**

1. **Verify identity** — Confirm request via authenticated session or email verification
2. **Revoke Plaid access** — Call Plaid's `/item/remove` endpoint for each connected bank account to revoke access tokens and terminate data sharing
3. **Delete Plaid data** — Remove all PlaidItem records (encrypted access tokens, item IDs, sync cursors) from the database
4. **Delete financial data** — Remove all transaction records, account records, and balance data
5. **Delete application data** — Remove all budgets, goals, and user preferences
6. **Delete user profile** — Remove user account record (name, email, password hash)
7. **Remove from marketing** — Unsubscribe email from all marketing lists
8. **Create anonymized audit record** — Log: anonymized deletion ID, deletion timestamp, systems affected (no personal data retained)
9. **Confirm to user** — Send confirmation email that account and all associated data have been deleted
10. **Retain audit record** — Anonymized deletion log retained for 90 days for compliance verification

**Data that is NOT recoverable after deletion:**
- All consumer financial data (transactions, balances, accounts)
- All personal data (name, email)
- All Plaid connections and access tokens
- All budgets, goals, and preferences

### 4.2 Bank Disconnection (Without Account Deletion)

When a consumer disconnects a specific bank account:

1. Call Plaid's `/item/remove` endpoint for the specific item
2. Delete the PlaidItem record (access token, item ID, cursor)
3. Delete all associated Account records
4. Delete all transactions associated with those accounts
5. Retain user profile and other connected accounts

### 4.3 Inactive Account Disposal

Accounts inactive for 24 months (no login or API activity):

1. Send notification email at 22 months: "Your SpendFixer account will be deleted in 60 days due to inactivity"
2. Send final reminder at 23 months
3. If no login occurs, execute full account deletion procedure (Section 4.1)
4. Log disposal as inactivity-triggered

### 4.4 Plaid Access Token Disposal

Plaid access tokens are disposed of:

- **Immediately** when a user disconnects a bank account
- **Immediately** when a user deletes their SpendFixer account
- **Immediately** upon token expiration or revocation by Plaid
- **Within 30 days** if SpendFixer determines the token is no longer needed for service delivery

Disposal method: Token record deleted from database. Since tokens are encrypted at rest, deletion of the record and encryption key renders the token unrecoverable.

### 4.5 Technical Disposal Methods

| Data Location | Disposal Method | Verification |
|--------------|----------------|--------------|
| PostgreSQL database | `DELETE` SQL operation; for bulk disposal, `TRUNCATE` | Query to verify zero matching records |
| Database backups | Backups containing deleted data expire per backup retention schedule (30 days). No selective deletion from backups. | Verify backup rotation removes old backups |
| Application logs | Automatic expiration per log provider retention settings | Verify log provider configuration |
| Vercel environment variables | Manual deletion via Vercel dashboard; redeployment to clear runtime cache | Verify via Vercel dashboard |
| Local development | No consumer data exists in development environments (sandbox/mock data only) | N/A |

### 4.6 Backup Consideration

- Database backups are retained for 30 days
- Consumer data deleted from the live database may persist in backups for up to 30 days until backup rotation completes
- Backups are encrypted at rest (AES-256) and access-restricted
- This 30-day backup retention is disclosed in the Privacy Policy

## 5. Consumer Rights

### 5.1 Right to Deletion

- Consumers may request deletion at any time via in-app settings or by emailing the support address
- Deletion is completed within 30 calendar days
- Confirmation is sent upon completion
- SpendFixer does not charge a fee for deletion requests

### 5.2 Right to Data Portability

- Consumers can export their transaction data via CSV (available in Plus plan and above)
- Export includes: date, merchant, amount, category for all transactions
- Export does NOT include: Plaid access tokens, internal IDs, or other system data

### 5.3 Right to Know

- Consumers can request a summary of what data SpendFixer holds about them
- Response provided within 30 calendar days

## 6. Compliance

### 6.1 Legal Requirements

| Regulation | Relevant Requirements | SpendFixer Compliance |
|-----------|----------------------|----------------------|
| **CCPA/CPRA** | Right to deletion, right to know, data minimization | Account deletion procedure, data inventory, 30-day response |
| **GLBA** | Protection of consumer financial information, disposal requirements | Encrypted storage, secure disposal, access controls |
| **Plaid Developer Policy** | Delete Plaid data when no longer needed, honor user revocation | Immediate token revocation on disconnect/deletion |

### 6.2 Verification

- Data retention compliance is verified during quarterly self-assessments
- Deletion procedures are tested annually (create test account, request deletion, verify complete removal)
- Retention periods are reviewed semi-annually and adjusted for regulatory changes

## 7. Exceptions

Any exception to the retention periods defined in this policy requires:

1. Documented business or legal justification
2. Approval from the system owner
3. Defined expiration date for the exception
4. Review at next policy review cycle

Potential exceptions: legal hold (litigation), regulatory investigation, law enforcement request.

## 8. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | February 24, 2026 | SpendFixer Security | Initial policy |
