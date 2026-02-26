# SpendFixer — Information Security Policy & Procedures

**Document Owner:** SpendFixer Security Team
**Effective Date:** February 2026
**Last Reviewed:** February 24, 2026
**Next Review:** August 2026
**Classification:** Internal — Confidential

---

## 1. Purpose & Scope

### 1.1 Purpose

This document establishes the information security program for SpendFixer, a personal finance application that connects to users' financial institutions via Plaid to aggregate transaction data, categorize spending, and provide budgeting insights. The program is designed to identify, mitigate, and continuously monitor information security risks to protect user data, maintain regulatory compliance, and preserve user trust.

### 1.2 Scope

This policy applies to:

- All SpendFixer systems, infrastructure, and code repositories
- All personnel (employees, contractors, advisors) with access to SpendFixer systems or data
- All third-party services integrated with SpendFixer (Plaid, Vercel, database providers, analytics)
- All user data collected, processed, stored, or transmitted by SpendFixer

### 1.3 Regulatory Context

SpendFixer operates within the following regulatory framework:

- **Gramm-Leach-Bliley Act (GLBA)** — Financial data privacy requirements
- **California Consumer Privacy Act (CCPA/CPRA)** — Consumer data rights
- **Plaid Developer Policy** — Third-party data access requirements
- **PCI DSS** awareness (SpendFixer does not directly process payment card data but handles financial account information)

---

## 2. Data Classification

### 2.1 Classification Levels

| Level | Definition | Examples | Handling Requirements |
|-------|-----------|----------|----------------------|
| **Critical** | Data whose exposure would cause severe harm to users or the business | Plaid access tokens, database credentials, API secrets, encryption keys | Encrypted at rest and in transit. Never logged. Access restricted to production systems only. No human access under normal operations. |
| **Sensitive** | User personal and financial data protected by regulation | Bank account numbers, transaction history, account balances, email addresses, passwords | Encrypted at rest and in transit. Access logged. Minimum necessary access. Retained only as long as needed. |
| **Internal** | Business data not intended for public disclosure | System architecture, internal metrics, employee information, security policies | Access limited to authorized personnel. Stored in access-controlled systems. |
| **Public** | Information intended for or safe for public access | Marketing content, public website, open-source dependencies, published pricing | No special handling required. |

### 2.2 Data Inventory

| Data Element | Classification | Storage Location | Retention | Encryption |
|-------------|---------------|-----------------|-----------|------------|
| Plaid access tokens | Critical | PostgreSQL (encrypted column) | Until user disconnects account | AES-256 at rest, TLS 1.2+ in transit |
| Plaid item IDs | Critical | PostgreSQL | Until user disconnects account | AES-256 at rest |
| User email addresses | Sensitive | PostgreSQL | Until account deletion + 30 days | AES-256 at rest |
| User passwords | Sensitive | PostgreSQL (hashed) | Until account deletion | bcrypt/argon2 hash, never stored in plaintext |
| Transaction data | Sensitive | PostgreSQL | Until account deletion or user request | AES-256 at rest |
| Account balances | Sensitive | PostgreSQL | Until account deletion | AES-256 at rest |
| Bank account names/types | Sensitive | PostgreSQL | Until account deletion | AES-256 at rest |
| Session tokens | Internal | Server memory / secure cookies | Session duration (max 24 hours) | Signed, HttpOnly, Secure, SameSite=Strict |
| Waitlist emails | Sensitive | PostgreSQL | Until launch + 90 days or unsubscribe | AES-256 at rest |
| Server logs | Internal | Vercel / log provider | 30 days | TLS in transit |

---

## 3. Risk Assessment

### 3.1 Risk Assessment Process

Risk assessments are conducted:

- **Annually** — comprehensive review of all systems and data flows
- **Upon significant change** — new integrations, infrastructure changes, or feature launches involving user data
- **Upon incident** — following any security event or near-miss

Each risk is evaluated on:

- **Likelihood** (1-5): probability of occurrence
- **Impact** (1-5): severity of harm if realized
- **Risk Score**: Likelihood × Impact
- **Risk Level**: Low (1-6), Medium (7-12), High (13-19), Critical (20-25)

### 3.2 Identified Risks & Mitigations

| ID | Risk | Likelihood | Impact | Score | Level | Mitigation | Status |
|----|------|-----------|--------|-------|-------|------------|--------|
| R-01 | Unauthorized access to Plaid access tokens | 2 | 5 | 10 | Medium | Tokens encrypted at rest (AES-256). No tokens in logs, client-side code, or version control. Server-side only access via environment variables. Database access restricted to application service account. | Active |
| R-02 | Database breach exposing user financial data | 2 | 5 | 10 | Medium | Database encryption at rest. Network-level access controls (private networking). Strong authentication. Regular backups with encryption. Connection via TLS only. | Active |
| R-03 | Credential stuffing / brute force on user accounts | 3 | 3 | 9 | Medium | Rate limiting on auth endpoints. Password complexity requirements (min 8 chars, mixed case/numbers). Account lockout after 5 failed attempts. bcrypt/argon2 password hashing. | Active |
| R-04 | Session hijacking | 2 | 4 | 8 | Medium | HttpOnly, Secure, SameSite=Strict cookies. Short session expiry (24h). Session invalidation on password change. HTTPS enforced on all routes. | Active |
| R-05 | Cross-site scripting (XSS) | 2 | 4 | 8 | Medium | Vue 3 auto-escapes template output. Content Security Policy headers. Input validation on all API routes. No innerHTML usage. | Active |
| R-06 | API abuse / data scraping | 3 | 3 | 9 | Medium | Rate limiting per user/IP. Authentication required for all data endpoints. Pagination limits enforced. Request size limits. | Active |
| R-07 | Third-party dependency vulnerability | 3 | 3 | 9 | Medium | Automated dependency scanning (npm audit, Dependabot/Renovate). Monthly manual review of critical dependencies. Pin major versions. | Active |
| R-08 | Plaid API key compromise | 1 | 5 | 5 | Low | Keys stored exclusively in Vercel environment variables (encrypted). Never committed to version control. .env in .gitignore. Plaid webhook signature verification. Key rotation capability. | Active |
| R-09 | Insider threat (unauthorized data access) | 1 | 5 | 5 | Low | Principle of least privilege. Production database access requires documented justification. All access logged. No standing admin access to production data. | Active |
| R-10 | Data loss / backup failure | 2 | 4 | 8 | Medium | Automated daily database backups. Backup encryption. Monthly backup restoration test. Multi-region backup storage. | Active |
| R-11 | Denial of service | 2 | 3 | 6 | Low | Vercel edge network with DDoS protection. Rate limiting. Auto-scaling serverless functions. | Active |
| R-12 | Insecure data transmission | 1 | 5 | 5 | Low | TLS 1.2+ enforced on all connections. HSTS header with max-age=63072000. No HTTP endpoints. Certificate auto-renewal via Vercel. | Active |

### 3.3 Risk Register Maintenance

- The risk register is reviewed and updated quarterly
- New risks identified through monitoring, incidents, or changes are added immediately
- Mitigations are validated through testing at least annually
- Risk owners are assigned for each identified risk

---

## 4. Access Control

### 4.1 Principles

- **Least privilege** — users and systems receive only the minimum access necessary
- **Need-to-know** — access to sensitive data requires documented business justification
- **Separation of duties** — no single individual has unchecked access to critical systems

### 4.2 Access Control Matrix

| System | Role | Access Level | Authentication | Review Frequency |
|--------|------|-------------|----------------|-----------------|
| Vercel (hosting) | Owner | Full | SSO + MFA | Quarterly |
| Vercel | Collaborator | Deploy only | SSO + MFA | Quarterly |
| PostgreSQL (production) | Application | Read/write via connection string | Connection string (environment variable) | N/A (automated) |
| PostgreSQL (production) | Admin | Full (emergency only) | MFA + VPN/IP allowlist | Each access event |
| Plaid Dashboard | Owner | Full | Email + MFA | Quarterly |
| GitHub/Git | Owner | Full | SSH key + MFA | Quarterly |
| GitHub/Git | Contributor | Push to feature branches | SSH key + MFA | Quarterly |

### 4.3 Procedures

**Granting access:**
1. Access request submitted with business justification
2. Approved by system owner
3. Access provisioned with minimum necessary permissions
4. Documented in access log

**Revoking access:**
1. Access removed within 24 hours of role change or departure
2. All active sessions invalidated
3. Any shared credentials rotated
4. Removal confirmed and documented

**Periodic review:**
1. All access reviewed quarterly
2. Unused access removed
3. Excessive permissions reduced
4. Review documented with findings and actions

### 4.4 Authentication Requirements

| Requirement | Standard |
|------------|----------|
| Multi-factor authentication | Required for all infrastructure and admin access |
| Password minimum length | 12 characters (internal systems), 8 characters (user accounts) |
| Password storage | bcrypt (cost factor 12) or argon2id |
| Session duration | 24 hours maximum, re-authentication for sensitive actions |
| API authentication | Bearer tokens with expiry, no long-lived static tokens for users |

---

## 5. Encryption & Data Protection

### 5.1 Encryption Standards

| Context | Standard | Implementation |
|---------|----------|---------------|
| Data in transit | TLS 1.2 minimum (TLS 1.3 preferred) | Vercel edge TLS termination, HSTS header |
| Data at rest (database) | AES-256 | Database provider managed encryption |
| Data at rest (backups) | AES-256 | Encrypted backup storage |
| Plaid access tokens | AES-256 (application-level) | Encrypted before storage, decrypted only server-side at time of use |
| User passwords | bcrypt (cost 12) or argon2id | One-way hash, never reversible |
| Session tokens | HMAC-SHA256 signed | Server-side validation |

### 5.2 Key Management

- Encryption keys stored in environment variables (Vercel encrypted storage)
- Keys never committed to version control
- Key rotation performed annually or upon suspected compromise
- Old keys retained temporarily for decryption of existing data during rotation
- Key access restricted to production runtime only

### 5.3 Plaid-Specific Data Protections

- Plaid access tokens are **never** exposed to the client/browser
- Public tokens are immediately exchanged server-side and discarded
- Access tokens are encrypted before database storage
- Plaid API calls are made exclusively server-side via Nuxt server routes
- Plaid webhook signatures are verified before processing
- User bank credentials are **never** handled by SpendFixer — Plaid manages all bank authentication

---

## 6. Secure Development

### 6.1 Development Practices

| Practice | Implementation |
|----------|---------------|
| Code review | All changes reviewed before merge to main |
| Dependency scanning | `npm audit` on every build, automated alerts for critical vulnerabilities |
| Secret detection | .gitignore includes .env files. Pre-commit hooks scan for secrets patterns. |
| Input validation | All API endpoints validate and sanitize input. Zod schemas for structured validation. |
| Output encoding | Vue 3 template auto-escaping. No raw HTML rendering of user input. |
| Error handling | Generic error messages to users. Detailed errors logged server-side only. No stack traces in production responses. |
| HTTPS enforcement | All endpoints HTTPS only. HSTS enabled. HTTP redirects to HTTPS. |

### 6.2 Security Headers

The following headers are configured on all responses:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0 (rely on CSP instead)
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.plaid.com; connect-src 'self' https://*.plaid.com; frame-src https://*.plaid.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;
```

### 6.3 Environment Separation

| Environment | Purpose | Data | Access |
|------------|---------|------|--------|
| Development | Local development | Mock/seed data only | Developer machine |
| Staging | Pre-production testing | Plaid sandbox (test data) | Restricted team access |
| Production | Live application | Real user data | Automated deployment only |

- Production credentials are never used in development or staging
- Plaid sandbox mode is used for all non-production environments
- Database instances are fully separated per environment

---

## 7. Incident Response

### 7.1 Incident Classification

| Severity | Definition | Response Time | Examples |
|----------|-----------|--------------|---------|
| **P1 — Critical** | Active data breach, production system compromise, or exposure of Critical data | Immediate (within 1 hour) | Database breach, Plaid token exposure, unauthorized access to user financial data |
| **P2 — High** | Security vulnerability actively exploitable, partial system compromise | Within 4 hours | XSS vulnerability in production, authentication bypass, API abuse detected |
| **P3 — Medium** | Vulnerability identified but not actively exploited, suspicious activity | Within 24 hours | Dependency vulnerability, unusual access patterns, failed brute force attempts |
| **P4 — Low** | Minor security improvement, policy violation without data exposure | Within 1 week | Misconfigured header, access review finding, documentation gap |

### 7.2 Incident Response Procedure

**Phase 1 — Detection & Triage (0-1 hour for P1)**
1. Incident detected via monitoring, alert, user report, or third-party notification
2. Severity assessed based on classification above
3. Incident logged with: timestamp, description, affected systems, affected data, detection method
4. Incident owner assigned

**Phase 2 — Containment (1-4 hours for P1)**
1. Isolate affected systems (revoke compromised credentials, disable affected endpoints)
2. Preserve evidence (logs, database snapshots, system state)
3. If Plaid tokens potentially compromised: immediately rotate all affected access tokens via Plaid API
4. If user data exposed: identify affected users and scope of exposure
5. Communicate status to stakeholders

**Phase 3 — Eradication & Recovery (4-24 hours for P1)**
1. Identify root cause
2. Remove threat actor access / patch vulnerability
3. Rotate all potentially compromised credentials
4. Restore systems from known-good state if needed
5. Verify fix effectiveness

**Phase 4 — Notification (within 72 hours for data breaches)**
1. If user personal/financial data was exposed:
   - Notify affected users via email with: what happened, what data was involved, what we're doing, what they should do
   - Notify relevant regulators as required (state breach notification laws, FTC if applicable)
   - Notify Plaid if Plaid-related data was involved
2. Document notification timeline and content

**Phase 5 — Post-Incident Review (within 1 week)**
1. Conduct blameless post-mortem
2. Document: timeline, root cause, impact, response effectiveness, lessons learned
3. Update risk register with new or modified risks
4. Implement preventive measures
5. Update this policy if process gaps identified

### 7.3 Contact Information

| Role | Responsibility | Contact |
|------|---------------|---------|
| Incident Commander | Overall incident management | [Owner — to be designated] |
| Technical Lead | Technical investigation and remediation | [Engineer — to be designated] |
| Communications | User and stakeholder notification | [Owner — to be designated] |
| Plaid Support | Third-party escalation | security@plaid.com |

---

## 8. Vendor & Third-Party Management

### 8.1 Approved Vendors

| Vendor | Service | Data Shared | Security Assessment | Contract/Terms |
|--------|---------|------------|---------------------|---------------|
| **Plaid** | Bank account linking, transaction data | User consent via Plaid Link; access tokens stored server-side | SOC 2 Type II, annual penetration testing, end-to-end encryption | Plaid Developer Agreement |
| **Vercel** | Application hosting, serverless functions, CDN | Application code, environment variables, server logs | SOC 2 Type II, ISO 27001, encrypted at rest and in transit | Vercel Terms of Service, DPA |
| **PostgreSQL provider** (e.g., Neon, Supabase) | Database hosting | All application data | SOC 2 Type II (verify per provider), encrypted at rest, private networking | Provider Terms, DPA |
| **Google Fonts** | Font delivery | User IP addresses (standard CDN request) | Google infrastructure security | Google Terms of Service |

### 8.2 Vendor Assessment Procedure

Before integrating any new third-party service that will process or store Sensitive or Critical data:

1. **Security review** — Verify SOC 2, ISO 27001, or equivalent certification
2. **Data flow mapping** — Document what data is shared, how it's transmitted, and where it's stored
3. **Contract review** — Ensure Data Processing Agreement (DPA) covers data protection, breach notification, and data deletion
4. **Access minimization** — Share only the minimum data necessary for the service
5. **Ongoing monitoring** — Review vendor security posture annually

### 8.3 Plaid-Specific Controls

- SpendFixer never receives or stores user bank login credentials — Plaid handles all bank authentication
- Plaid access tokens are treated as Critical data
- SpendFixer requests only the Plaid products necessary for functionality (Transactions, Recurring Transactions)
- User consent is collected via Plaid Link's standardized consent flow
- Users can disconnect their bank at any time, which triggers access token deletion
- Plaid's data retention and privacy practices are governed by Plaid's End User Privacy Policy

---

## 9. User Data Rights & Privacy

### 9.1 User Rights

SpendFixer supports the following user rights:

| Right | Implementation |
|-------|---------------|
| **Access** | Users can view all their data within the application (transactions, accounts, budgets, goals) |
| **Deletion** | Users can request full account deletion. Upon request: user record deleted, all transactions deleted, all Plaid access tokens revoked and deleted, all accounts deleted. Completed within 30 days. |
| **Portability** | Users can export their transaction data via CSV (Plus plan and above) |
| **Correction** | Users can update their profile information at any time |
| **Revocation** | Users can disconnect any linked bank account at any time, immediately revoking Plaid access |
| **Opt-out** | Users can opt out of marketing communications at any time |

### 9.2 Data Deletion Procedure

When a user requests account deletion:

1. Verify user identity (authenticated session or email verification)
2. Revoke all Plaid access tokens via Plaid API (`/item/remove`)
3. Delete all user records from database: transactions, accounts, PlaidItems, budgets, goals, user profile
4. Remove email from any marketing lists
5. Retain minimal audit log (anonymized deletion timestamp) for 90 days
6. Confirm deletion to user via email

### 9.3 Privacy Policy Requirements

SpendFixer's public Privacy Policy must include:

- What data we collect and why
- How we use Plaid and what data Plaid accesses
- How data is stored and protected
- User rights and how to exercise them
- Data retention periods
- Third-party data sharing (limited to service providers, no selling of user data)
- Contact information for privacy inquiries
- Cookie/tracking disclosure

---

## 10. Monitoring & Logging

### 10.1 What We Monitor

| Category | What | Tool | Alert Threshold |
|----------|------|------|----------------|
| **Authentication** | Failed login attempts, successful logins from new locations | Application logs | 5+ failed attempts from same IP in 5 minutes |
| **API abuse** | Request rate, unusual access patterns | Vercel analytics + application middleware | >100 requests/minute from single user |
| **Error rates** | 500 errors, Plaid API failures, database errors | Vercel logs, application error tracking | >1% error rate over 5-minute window |
| **Dependency vulnerabilities** | Known CVEs in npm packages | `npm audit`, Dependabot/Renovate | Any critical or high severity |
| **Uptime** | Application availability | Vercel status, external uptime monitor | Any downtime >2 minutes |
| **Data access** | Database queries to sensitive tables | Database audit logs (if supported by provider) | Any direct admin access |

### 10.2 Logging Standards

- **Do log:** Authentication events, API requests (method, path, status, user ID, timestamp), error events, security-relevant actions (account creation, deletion, bank connection/disconnection), admin access
- **Never log:** Passwords, Plaid access tokens, full bank account numbers, session tokens, API secrets, raw request bodies containing sensitive data
- **Log retention:** 30 days for application logs, 90 days for security-relevant events
- **Log access:** Restricted to authorized personnel, read-only

### 10.3 Review Schedule

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Review security alerts and logs | Daily (automated alerts) | Engineering |
| Review access control lists | Quarterly | Security lead |
| Full risk assessment review | Annually | Security lead |
| Dependency vulnerability scan | Weekly (automated) | Engineering |
| Backup restoration test | Monthly | Engineering |
| Incident response plan review | Annually | All stakeholders |
| Vendor security review | Annually | Security lead |
| Penetration testing | Annually (or before major launches) | External firm |

---

## 11. Business Continuity

### 11.1 Backup Strategy

| Data | Method | Frequency | Retention | Location |
|------|--------|-----------|-----------|----------|
| PostgreSQL database | Automated snapshot | Daily | 30 days | Provider-managed, separate region |
| Application code | Git repository | Every commit | Indefinite | GitHub (private repo) |
| Environment variables | Vercel encrypted storage | On change | Current version | Vercel |
| Security documentation | Version-controlled | On change | Indefinite | Private repository |

### 11.2 Recovery Objectives

| Metric | Target |
|--------|--------|
| Recovery Time Objective (RTO) | 4 hours |
| Recovery Point Objective (RPO) | 24 hours (last daily backup) |

### 11.3 Recovery Procedure

1. Assess scope of data loss or system failure
2. If application failure: redeploy from last known-good Git commit to Vercel
3. If database failure: restore from most recent backup
4. If credential compromise: rotate all affected credentials, redeploy
5. Verify application functionality and data integrity
6. Notify affected users if any data loss occurred

---

## 12. Policy Governance

### 12.1 Review & Updates

- This policy is reviewed **semi-annually** (February and August)
- Updates are triggered by: security incidents, regulatory changes, significant infrastructure changes, audit findings, or Plaid requirement changes
- All changes are version-controlled with change descriptions
- Previous versions are retained for audit purposes

### 12.2 Compliance Verification

| Method | Frequency | Scope |
|--------|-----------|-------|
| Internal self-assessment | Quarterly | All policy sections |
| Dependency audit | Monthly | Third-party packages |
| Access review | Quarterly | All systems in access control matrix |
| Penetration test | Annually | External-facing application |
| Plaid compliance check | Before production launch, annually | Plaid developer policy requirements |

### 12.3 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | February 24, 2026 | SpendFixer Security | Initial policy creation |

---

## Appendix A: Security Checklist — Pre-Production Launch

- [ ] All Plaid access tokens encrypted at rest
- [ ] Plaid sandbox credentials replaced with production credentials (stored in environment variables only)
- [ ] Database encryption at rest enabled
- [ ] Database connections restricted to application IP/private network
- [ ] All API endpoints require authentication (except public landing page and waitlist)
- [ ] Rate limiting enabled on authentication and API endpoints
- [ ] Security headers configured (HSTS, CSP, X-Frame-Options, etc.)
- [ ] .env and secrets excluded from version control (.gitignore verified)
- [ ] Password hashing implemented (bcrypt cost 12 or argon2id)
- [ ] Session management secure (HttpOnly, Secure, SameSite cookies)
- [ ] Error messages do not expose internal details
- [ ] Logging configured (no sensitive data in logs)
- [ ] Backup strategy tested (restore from backup verified)
- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] User data deletion flow implemented and tested
- [ ] npm audit shows no critical vulnerabilities
- [ ] HTTPS enforced on all routes (no HTTP fallback)

## Appendix B: Plaid Production Readiness Checklist

- [ ] Plaid Developer Policy reviewed and acknowledged
- [ ] Only necessary Plaid products requested (Transactions, Recurring Transactions)
- [ ] Plaid Link consent flow implemented correctly
- [ ] Access token storage encrypted
- [ ] Access token rotation procedure documented
- [ ] User can disconnect accounts (triggers /item/remove)
- [ ] Plaid webhook signature verification implemented
- [ ] Error handling for Plaid API failures (token expiry, institution downtime)
- [ ] Privacy Policy references Plaid and Plaid's End User Privacy Policy
- [ ] Data retention policy aligns with Plaid requirements
