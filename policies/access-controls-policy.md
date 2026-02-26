# SpendFixer — Access Controls Policy

**Document Owner:** SpendFixer Security  
**Effective Date:** February 24, 2026  
**Last Reviewed:** February 24, 2026  
**Next Review:** August 2026  
**Classification:** Internal — Confidential

---

## 1. Purpose

This policy defines the access control requirements for all SpendFixer systems, infrastructure, and data. It ensures that access to production assets and sensitive consumer financial data is restricted to authorized individuals with a documented business need, using the principle of least privilege.

## 2. Scope

This policy applies to:

- All production infrastructure (Vercel hosting, PostgreSQL database, serverless functions)
- All third-party platforms that store or process consumer data (Plaid, database provider)
- All administrative and development tools (GitHub, Vercel dashboard, Plaid dashboard)
- All personnel (employees, contractors, advisors) with access to any SpendFixer system

## 3. Access Control Principles

### 3.1 Role-Based Access Control (RBAC)

All access is granted based on defined roles with specific, limited permissions:

| Role | Systems | Permissions | Justification |
|------|---------|------------|---------------|
| **Owner** | Vercel, Plaid, Database, GitHub | Full administrative access | Business owner — required for platform management |
| **Developer** | GitHub (feature branches), Vercel (deploy preview) | Read/write code, deploy to staging | Development — no direct production data access |
| **Application Service** | PostgreSQL | Read/write application data | Automated — connection string in environment variables |
| **Database Admin** | PostgreSQL | Full (emergency only) | Break-glass access — requires documented justification |

No user receives permissions beyond what their role requires.

### 3.2 Principle of Least Privilege

- Users receive only the minimum access necessary to perform their function
- Broad permissions (e.g., database admin) are not granted by default
- Access is scoped to specific systems and actions
- Elevated access requires documented business justification and is time-limited when possible

### 3.3 Zero Trust Architecture

SpendFixer operates on a zero trust model:

- **No implicit trust:** All access requests are verified regardless of network location
- **Verify explicitly:** Every access to production systems requires authentication via SSO + MFA
- **Least privilege access:** Permissions are scoped narrowly per role (see RBAC above)
- **Assume breach:** Systems are designed so that compromise of one component does not grant access to others
- **No VPN-based trust:** Access is authenticated per-service, not by network perimeter
- **Serverless architecture:** No standing servers to compromise — functions execute on-demand in isolated containers

### 3.4 Non-Human Authentication

- **Application-to-database:** Authenticated via connection string (stored as encrypted environment variable in Vercel). Rotated upon suspected compromise or personnel change.
- **Application-to-Plaid API:** Authenticated via client ID + secret (stored as encrypted environment variables). Never exposed client-side.
- **CI/CD deployments:** Authenticated via Vercel project tokens scoped to specific projects.
- **No long-lived static API keys** are used for user-facing authentication. User sessions use signed, expiring tokens.

## 4. Authentication Requirements

### 4.1 Administrative Access (Internal Systems)

| Requirement | Standard |
|------------|----------|
| Multi-factor authentication | **Required** for all infrastructure access (Vercel, Plaid, database, GitHub) |
| MFA type | Phishing-resistant: hardware security keys, biometric authentication, or passkeys preferred. TOTP authenticator apps accepted. SMS-based MFA is not accepted. |
| Password minimum length | 12 characters |
| Password complexity | Mixed case, numbers, and special characters required |
| Password reuse | Prohibited — no reuse of last 10 passwords |
| Session duration | Maximum 24 hours for dashboard access; re-authentication required for sensitive actions |

### 4.2 Consumer Access (Application Users)

| Requirement | Standard |
|------------|----------|
| Authentication method | Email + password |
| Password minimum length | 8 characters |
| Password storage | bcrypt (cost factor 12) or argon2id — never stored in plaintext |
| Session management | Signed HttpOnly, Secure, SameSite=Strict cookies. Maximum 24-hour session. |
| Account lockout | After 5 consecutive failed login attempts, account is locked for 15 minutes |
| Rate limiting | Authentication endpoints limited to 10 requests per minute per IP |

## 5. Access Provisioning

### 5.1 Granting Access

1. Requestor submits access request specifying: system, role, business justification
2. System owner reviews and approves or denies
3. Access provisioned with the minimum permissions required for the stated purpose
4. Access grant documented in the access log with: date, requestor, approver, system, role granted

### 5.2 Modifying Access

1. Role changes require new access request following the same approval process
2. Previous role permissions are revoked before new permissions are granted
3. Temporary elevated access is time-limited (maximum 72 hours) and automatically revoked

### 5.3 Revoking Access

Access is revoked:

- **Within 24 hours** of personnel departure or role change
- **Immediately** upon suspected compromise or policy violation
- **Upon project completion** for contractors with time-limited engagements

Revocation procedure:

1. Remove user from all systems (Vercel team, GitHub org, database access, Plaid dashboard)
2. Invalidate all active sessions
3. Rotate any shared credentials the individual had access to
4. Document revocation with date and systems affected
5. Verify revocation is complete

## 6. Periodic Access Reviews

| Review Activity | Frequency | Reviewer | Documentation |
|----------------|-----------|----------|---------------|
| Full access review — all systems | **Quarterly** | System owner | List of all users, roles, and permissions reviewed. Findings and actions documented. |
| Privileged access review | **Monthly** | System owner | Verify no unauthorized admin-level access exists |
| Service account review | **Quarterly** | Engineering | Verify application credentials are current and scoped correctly |
| Dormant account review | **Quarterly** | System owner | Accounts inactive for 90+ days are disabled |

### Review Procedure

1. Generate current access list for each system
2. Verify each user's role and permissions against documented business justification
3. Identify and remediate: unused access, excessive permissions, departed personnel, dormant accounts
4. Document review findings, actions taken, and date of completion
5. Escalate unresolved findings to system owner

## 7. Sensitive Data Access

### 7.1 Consumer Financial Data

- Consumer financial data (transactions, account balances, Plaid access tokens) is accessed exclusively by the application service account through the application layer
- **No human has standing access** to consumer financial data under normal operations
- Emergency access to the production database requires:
  1. Documented justification (e.g., incident response, data recovery)
  2. Approval from system owner
  3. MFA authentication
  4. All queries logged for audit
  5. Access revoked immediately after task completion

### 7.2 Plaid Access Tokens

- Classified as **Critical** data
- Stored encrypted (AES-256) in the database
- Accessible only by the application at runtime — never exposed in logs, client-side code, or admin interfaces
- Never included in database exports or backups in plaintext
- Revoked via Plaid API when a user disconnects their account or deletes their SpendFixer account

## 8. Logging and Monitoring

All access to production systems is logged:

| Event | Logged Data | Retention |
|-------|------------|-----------|
| Successful authentication | User ID, timestamp, system, IP address | 90 days |
| Failed authentication | Attempted user ID, timestamp, system, IP address | 90 days |
| Access provisioning/revocation | User ID, system, role, action, approver, timestamp | 1 year |
| Production database access | User ID, timestamp, query type | 90 days |
| Elevated privilege usage | User ID, justification, timestamp, actions performed | 1 year |

Alerts are triggered for:

- 5+ failed authentication attempts from a single IP within 5 minutes
- Any direct database access outside the application service account
- Access provisioning or revocation events
- Authentication from previously unseen locations

## 9. Policy Violations

Violations of this policy may result in:

- Immediate access revocation
- Incident investigation per the Incident Response Plan
- Corrective action as appropriate

All violations are documented and reviewed to identify systemic improvements.

## 10. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | February 24, 2026 | SpendFixer Security | Initial policy |
