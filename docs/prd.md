# DirectorforGood Agent Platform — PRD

**Version**: 1.0  
**Date**: January 25, 2026  
**Author**: AI Product Copilot  
**Status**: Draft (pending stakeholder review)

---

## Table of Contents

1. [Background / Problem Statement](#1-background--problem-statement)
2. [Goals and Non-Goals](#2-goals-and-non-goals)
3. [Target Users / Personas](#3-target-users--personas)
4. [User Journeys / Key Flows](#4-user-journeys--key-flows)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Data Model](#7-data-model)
8. [Integrations / External Dependencies](#8-integrations--external-dependencies)
9. [Permissions / Roles / Auth](#9-permissions--roles--auth)
10. [UX Notes / Screens](#10-ux-notes--screens)
11. [Analytics / Success Metrics](#11-analytics--success-metrics)
12. [Edge Cases & Failure Modes](#12-edge-cases--failure-modes)
13. [Risks, Open Questions, and Out-of-Scope](#13-risks-open-questions-and-out-of-scope)
14. [Release Plan](#14-release-plan)
15. [Epics + User Stories](#15-epics--user-stories)
16. [Verification Checklist](#16-verification-checklist)

---

## 1. Background / Problem Statement

### The Problem

Nonprofit Executive Directors (EDs) are overwhelmed. They wear too many hats — fundraising, finance, compliance, communications, operations — often without adequate staff. When funding dips, they cut staff first, creating a death spiral: fewer resources → worse execution → less funding.

**Current state without support:**
- ED works 60-80 hour weeks
- Books closed late or not at all
- Donor relationships neglected (renewal rates drop)
- Compliance deadlines missed
- Communications sporadic
- No runway visibility → constant financial anxiety

**The opportunity:**
Small-to-medium nonprofits ($200K–$2M budget) cannot afford a full C-suite but desperately need fractional expertise. AI agents, supervised by experienced humans (FDDs), can provide this at a fraction of traditional consulting costs.

### The Solution: DirectorforGood

An **agent platform** that deploys AI Directors as fractional staff:
- **6 AI Directors** (Finance, Development, Ops, Communications, Program, ED Copilot) do real work
- **Forward Deployed Directors (FDDs)** — humans — provide oversight and intervention
- **Clients** see outputs (reports, recommendations, drafted communications) not software
- **Progressive autonomy** — agents earn trust over time, reducing human intervention

---

## 2. Goals and Non-Goals

### Business Goals

| Goal | Metric | Target |
|------|--------|--------|
| Prove agent model works | % of tasks completed without human intervention | >70% within 6 months |
| Acquire pilot clients | # of paying clients | 3-5 by Q2 2026 |
| Demonstrate ROI | ED hours saved per client per week | 10+ hours |
| Build trust | NPS from pilot clients | >50 |

### User Goals

**For Nonprofit EDs:**
- Reduce time on back-office work from 70% → 30%
- Always know runway (cash position, months of runway)
- Never miss compliance deadlines
- Have consistent donor communications (monthly newsletters, weekly social)
- Get meeting prep and follow-up handled automatically

**For FDDs:**
- See all clients at a glance
- Quickly review and approve agent work
- Intervene when needed without friction
- Train agents by correcting outputs

### Non-Goals (Out of Scope for MVP)

- Mobile app (web-only for MVP)
- Full CRM replacement (integrate with existing CRMs)
- Direct payment processing (Stripe integration deferred)
- White-labeling for other platforms
- Self-service onboarding (FDD-assisted only)
- Fully autonomous agents (always some human oversight in MVP)

---

## 3. Target Users / Personas

### Primary: Nonprofit Executive Director (Maya)
- **Demographics**: 35-55, leads org with $300K–$1.5M budget
- **Pain points**: Overwhelmed, wearing too many hats, no finance/ops staff, donor relationships suffering
- **Tech comfort**: Uses Google Workspace, QuickBooks; not highly technical
- **Desired outcome**: "I want to focus on programs and fundraising, not back-office work"

### Secondary: Forward Deployed Director (Pat)
- **Demographics**: 30-50, nonprofit consultant or DirectorforGood staff
- **Pain points**: Manages 5-10 clients, needs efficiency, hates context-switching
- **Tech comfort**: High; comfortable with dashboards, APIs
- **Desired outcome**: "I want to see all my clients' health at a glance and only intervene when needed"

### Tertiary: Board Member / Funder (Chris)
- **Demographics**: 40-65, serves on nonprofit board or is foundation program officer
- **Pain points**: Wants visibility into org health, governance compliance
- **Tech comfort**: Low-to-medium; expects reports, not dashboards
- **Desired outcome**: "I want to know this org is well-managed without micromanaging"

---

## 4. User Journeys / Key Flows

### Journey 1: Client Onboarding (FDD-Assisted)

```
1. FDD has discovery call with nonprofit ED
2. FDD creates org in DirectorforGood (`/admin/orgs/new`)
3. FDD configures Directors (which 5-6 are active, what autonomy level)
4. FDD connects integrations (QuickBooks, Google Workspace)
5. FDD seeds initial data (budget, key donors, compliance calendar)
6. FDD grants client portal access to ED
7. ED receives welcome email with portal link
8. ED logs into portal, sees Dashboard with first Director activity
```

### Journey 2: Finance Director — Monthly Close

```
1. [Trigger] First Monday of month (cron)
2. Finance Director agent pulls transactions from QuickBooks
3. Agent categorizes expenses, flags anomalies
4. Agent generates "Monthly Close" report
5. Agent creates task: "Review flagged transactions" (requires FDD approval)
6. FDD reviews in console, approves or adjusts
7. Client portal shows: "January books closed. Runway: 7.2 months"
8. If anomaly is significant, FDD escalates to ED via portal notification
```

### Journey 3: Development Director — Post-Meeting Debrief

```
1. [Trigger] Calendar event ends (Google Calendar webhook)
2. System triggers Retell AI voice call to ED
3. ED answers, provides 3-5 minute debrief
4. Agent transcribes, extracts: takeaways, commitments, next steps
5. Notes written to Google Doc and logged in database
6. Development Director agent creates follow-up tasks:
   - Draft thank-you email (auto-generated)
   - Update CRM with meeting notes
   - Schedule next touchpoint
7. FDD reviews drafted email, approves for send
8. ED sees in portal: "Follow-up email sent to Ford Foundation"
```

### Journey 4: FDD Daily Review

```
1. FDD opens console (`/fdd/dashboard`)
2. Dashboard shows:
   - 3 clients with pending approvals
   - 1 client with alert (runway < 3 months)
   - 12 agent actions awaiting review
3. FDD clicks into HiiiWAV, reviews Finance Director's monthly report
4. FDD approves report, adds note: "Looks good, runway improving"
5. FDD clicks into OTW, sees flagged expense ($5K with no vendor)
6. FDD messages ED via portal chat: "What's this $5K expense?"
7. ED responds; FDD updates categorization
8. FDD marks all approvals complete, moves to next client
```

### Journey 5: ED Checks In on Portal

```
1. ED opens portal (`/client/hiiiwav/portal`)
2. Dashboard shows:
   - Activity feed: 8 actions this week
   - Pending approvals: 1 (draft email to major donor)
   - Reports: January Finance Report, Runway Forecast
   - Next tasks: Send Q4 newsletter (scheduled tomorrow)
3. ED reviews draft email, edits slightly, approves
4. ED clicks into Finance Report, sees runway visualization
5. ED has question, opens chat with Development Director
6. Chat response (agent or FDD) within 2 hours
```

---

## 5. Functional Requirements

### P0 — Must Have (MVP)

| ID | Requirement | Notes |
|----|-------------|-------|
| F1 | **Agent Runtime** — Execute agent tasks with tool calls, logging, and approval workflows | Core infrastructure |
| F2 | **Tool Framework** — Standardized interface for internal (DB, reports) and external (QuickBooks, Google) tools | Enable agent actions |
| F3 | **agentActions Audit Log** — Every agent action logged with input/output, approval status, execution time | Critical for trust |
| F4 | **Client Portal** — Activity feed, pending approvals, reports, chat interface | Minimal but polished |
| F5 | **FDD Console** — Multi-client dashboard, per-client drill-down, approval queue, intervention tools | Power user interface |
| F6 | **Finance Director Agent** — Monthly close, runway calculation, budget vs actuals | Most requested |
| F7 | **Development Director Agent** — Meeting debrief (extend existing), donor pipeline, follow-up drafts | High-value |
| F8 | **QuickBooks Integration** — Read transactions, read/write invoices | Required for Finance |
| F9 | **Google Calendar/Docs Integration** — Triggers, document writing | Extend existing |
| F10 | **Approval Workflow** — Route high-risk actions to FDD or client for approval | Safety mechanism |

### P1 — Should Have (V1)

| ID | Requirement | Notes |
|----|-------------|-------|
| F11 | **Operations Director Agent** — Compliance calendar, recurring tasks | Requested by pilots |
| F12 | **Communications Director Agent** — Newsletter scheduling, social content | Visible impact |
| F13 | **ED Copilot Agent** — Coordinate other Directors, time protection, briefings | Strategic value |
| F14 | **Progressive Autonomy** — Track approval rates, auto-upgrade autonomy level | Reduce FDD load |
| F15 | **Email Tool** — Draft and send emails (with approval) | Development Director needs |
| F16 | **Report Generator** — Impact reports, board packets, annual reports | High-value output |
| F17 | **Client Analytics** — Show ED hours saved, tasks completed, runway trend | Prove ROI |

### P2 — Nice to Have (V2)

| ID | Requirement | Notes |
|----|-------------|-------|
| F18 | **Program Director Agent** — Participant tracking, outcome measurement | Lower priority |
| F19 | **Stripe Integration** — Donation tracking | Deferred |
| F20 | **Mailchimp/Resend Integration** — Email marketing | Via Comms Director |
| F21 | **Salesforce NPSP Integration** — CRM sync | Enterprise clients |
| F22 | **Agent Learning** — Improve from FDD corrections | Long-term value |
| F23 | **Self-Service Onboarding** — Clients can sign up without FDD | Scale |
| F24 | **Mobile-Responsive Portal** — Better phone experience | Not full app |

---

## 6. Non-Functional Requirements

### Performance

| Metric | Target |
|--------|--------|
| API response time (p95) | < 500ms |
| Agent task execution | < 30s for simple tasks, < 5min for complex |
| Dashboard load time | < 2s |
| Concurrent users supported | 100 FDDs, 500 clients |

### Reliability

| Metric | Target |
|--------|--------|
| Uptime | 99.5% |
| Data backup frequency | Daily |
| Disaster recovery RTO | 4 hours |
| Scheduled maintenance window | Sundays 2-6am PT |

### Accessibility

- WCAG 2.1 AA compliance for client portal
- Keyboard navigation for all critical flows
- Screen reader compatible

### Security & Privacy

| Requirement | Implementation |
|-------------|----------------|
| Authentication | NextAuth.js with password + optional SSO |
| Authorization | Role-based: admin, fdd, client |
| Encryption at rest | Neon PostgreSQL encryption |
| Encryption in transit | TLS 1.3 |
| PII handling | Donor data encrypted, access logged |
| Data retention | 2 years, client can request deletion |
| Audit log | All agent actions, user actions, data access |

### Observability

- Error tracking: Sentry
- Analytics: Vercel Analytics + custom events
- Logging: Structured JSON logs to Vercel
- Metrics: Agent execution time, approval rates, error rates

---

## 7. Data Model

### Core Entities

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA MODEL                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ORGANIZATIONS                 USERS                   DIRECTORS             │
│  ┌─────────────┐              ┌─────────────┐         ┌─────────────┐       │
│  │ orgs        │              │ users       │         │ directors   │       │
│  │─────────────│              │─────────────│         │─────────────│       │
│  │ id          │              │ id          │         │ id          │       │
│  │ slug        │              │ email       │         │ slug        │       │
│  │ name        │──┐           │ name        │         │ name        │       │
│  │ domains[]   │  │           │ role        │         │ mission     │       │
│  └─────────────┘  │           │ org_id (FK) │◄────────│ color       │       │
│                   │           └─────────────┘         │ icon        │       │
│                   │                                   └─────────────┘       │
│                   │                                          │               │
│                   ▼                                          ▼               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    AGENT RUNTIME TABLES (NEW)                        │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                      │   │
│  │  agentActions                    tools                               │   │
│  │  ┌─────────────────┐            ┌─────────────────┐                 │   │
│  │  │ id              │            │ id              │                 │   │
│  │  │ org_slug        │            │ name            │                 │   │
│  │  │ agent_slug      │            │ category        │                 │   │
│  │  │ action_type     │            │ risk_level      │                 │   │
│  │  │ tool_used       │────────────│ input_schema    │                 │   │
│  │  │ input_data      │            │ output_schema   │                 │   │
│  │  │ output_data     │            └─────────────────┘                 │   │
│  │  │ status          │                                                │   │
│  │  │ requires_approval│           orgToolAccess                       │   │
│  │  │ approved_by     │            ┌─────────────────┐                 │   │
│  │  │ executed_at     │            │ id              │                 │   │
│  │  │ error_message   │            │ org_slug        │                 │   │
│  │  │ side_effects[]  │            │ tool_id         │                 │   │
│  │  │ trigger_source  │            │ enabled         │                 │   │
│  │  │ parent_action_id│            │ requires_approval│                │   │
│  │  └─────────────────┘            │ integration_id  │                 │   │
│  │                                 └─────────────────┘                 │   │
│  │  agentSessions                                                      │   │
│  │  ┌─────────────────┐            orgIntegrations                     │   │
│  │  │ id              │            ┌─────────────────┐                 │   │
│  │  │ org_slug        │            │ id              │                 │   │
│  │  │ agent_slug      │            │ org_slug        │                 │   │
│  │  │ session_type    │            │ type (qbo,goog) │                 │   │
│  │  │ status          │            │ access_token    │                 │   │
│  │  │ summary         │            │ refresh_token   │                 │   │
│  │  │ action_count    │            │ token_expires_at│                 │   │
│  │  └─────────────────┘            │ config          │                 │   │
│  │                                 │ status          │                 │   │
│  │                                 └─────────────────┘                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  EXISTING TABLES (retain)                                                    │
│  ─────────────────────────                                                   │
│  directorGoals, directorTasks, directorMetrics                              │
│  parties, partyRoles, relationships                                         │
│  proposals, proposalItems                                                   │
│  events, eventParticipants                                                  │
│  debriefCalls                                                               │
│  pages, posts, newsletters, media, redirects                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Relationships

- `orgs` 1:N `users` (org members)
- `orgs` 1:N `agentActions` (all actions for that org)
- `directors` 1:N `directorGoals`, `directorTasks`, `directorMetrics`
- `agentActions` N:1 `tools` (which tool was used)
- `orgs` 1:N `orgIntegrations` (QuickBooks, Google, etc.)
- `orgs` 1:N `orgToolAccess` (which tools enabled per org)

### Data Retention

| Data Type | Retention | Notes |
|-----------|-----------|-------|
| Agent actions | 2 years | Full audit trail |
| Transcripts | 1 year | Debrief call transcripts |
| Client data (donors, etc.) | Indefinite | Client owns, can request deletion |
| Session logs | 90 days | For debugging |
| Metrics | Indefinite | Aggregated, no PII |

---

## 8. Integrations / External Dependencies

| Integration | Purpose | Priority | Status |
|-------------|---------|----------|--------|
| **QuickBooks Online** | Finance Director — transactions, invoices, runway | P0 | Not started |
| **Google Calendar** | Meeting triggers, scheduling | P0 | Partial (webhooks exist) |
| **Google Docs** | Document writing (debriefs, reports) | P0 | Implemented |
| **Retell AI** | Voice calls for meeting debriefs | P0 | Implemented |
| **OpenAI / Anthropic** | Agent LLM backbone | P0 | Implemented (Vercel AI SDK) |
| **Neon PostgreSQL** | Primary database | P0 | Implemented |
| **NextAuth.js** | Authentication | P0 | Implemented |
| **Vercel** | Hosting, serverless functions, cron | P0 | Implemented |
| **Resend / Mailchimp** | Email sending | P1 | Not started |
| **Stripe** | Donation tracking | P2 | Not started |
| **Salesforce NPSP** | CRM sync | P2 | Not started |

---

## 9. Permissions / Roles / Auth

### Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `admin` | DirectorforGood platform admin | Full access to all orgs, system config |
| `fdd` | Forward Deployed Director | View/manage assigned orgs, approve actions, intervene |
| `client_admin` | Nonprofit ED/admin | View own org, approve high-risk actions, chat, view reports |
| `client_user` | Nonprofit staff | View own org (limited), no approval rights |

### Permission Matrix

| Action | admin | fdd | client_admin | client_user |
|--------|-------|-----|--------------|-------------|
| View all orgs | ✓ | ✗ | ✗ | ✗ |
| View assigned org | ✓ | ✓ | ✓ | ✓ |
| Approve agent actions | ✓ | ✓ | ✓ (high-risk only) | ✗ |
| Modify agent config | ✓ | ✓ | ✗ | ✗ |
| Connect integrations | ✓ | ✓ | ✓ (with FDD) | ✗ |
| View reports | ✓ | ✓ | ✓ | ✓ |
| Chat with Directors | ✓ | ✓ | ✓ | ✓ |
| Manage users | ✓ | ✗ | ✓ (own org) | ✗ |

---

## 10. UX Notes / Screens

### Client Portal (Minimal, Output-Focused)

```
┌────────────────────────────────────────────────────────────────────┐
│  HiiiWAV Dashboard                              [Maya] [Settings]  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  📊 This Week's Activity                                           │
│  ─────────────────────────────────────────────────────────────     │
│  ✓ Finance Director closed January books                          │
│  ✓ Finance Director updated runway forecast (7.2 months)          │
│  ⏳ Development Director drafted Ford Foundation follow-up         │
│  ✓ Comms Director scheduled 5 social posts                        │
│                                                                    │
│  ⚠️ Needs Your Approval (1)                                        │
│  ─────────────────────────────────────────────────────────────     │
│  📧 Draft email to Sarah Chen (Ford Foundation)                    │
│     [Preview] [Approve] [Edit & Approve]                          │
│                                                                    │
│  📈 Key Metrics                                                    │
│  ─────────────────────────────────────────────────────────────     │
│  Runway: 7.2 months  │  Donor Touches: 12/20  │  Posts: 5/week    │
│                                                                    │
│  📄 Recent Reports                                                 │
│  ─────────────────────────────────────────────────────────────     │
│  • January 2026 Financial Summary                   [View PDF]     │
│  • Q4 2025 Impact Report                           [View PDF]     │
│                                                                    │
│  💬 Chat with Directors                                            │
│  ─────────────────────────────────────────────────────────────     │
│  [Ask a question...]                                              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### FDD Console (Power User)

```
┌────────────────────────────────────────────────────────────────────┐
│  FDD Console — Pat's Dashboard                    [All Clients ▼]  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  🚨 Needs Attention (2)                                            │
│  ─────────────────────────────────────────────────────────────     │
│  • HiiiWAV: Finance Director flagged $5K expense                  │
│  • OTW: QuickBooks token expired — needs reconnect                │
│                                                                    │
│  📋 Pending Reviews (7)                                            │
│  ─────────────────────────────────────────────────────────────     │
│  [✓] HiiiWAV: Monthly close report                   [Approve]    │
│  [ ] HiiiWAV: Donor follow-up email (3)              [Review]     │
│  [ ] OTW: Sponsorship deck update                    [Review]     │
│  ...                                                              │
│                                                                    │
│  📊 Client Health                                                  │
│  ─────────────────────────────────────────────────────────────     │
│  HiiiWAV    ████████░░ 80%   7.2mo runway  ✓ Integrations OK      │
│  OTW        ██████████ 95%   N/A           ⚠️ QB expired           │
│  Zoo Labs   ██████░░░░ 60%   3.1mo runway  ✓ Integrations OK      │
│                                                                    │
│  📈 This Week: 47 actions │ 12 reviews │ 2 escalations             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 11. Analytics / Success Metrics

### Key Performance Indicators (KPIs)

| KPI | Definition | Target | Tracking Method |
|-----|------------|--------|-----------------|
| Agent Autonomy Rate | % of actions executed without human approval | >70% | `agentActions.requiresApproval = false` |
| FDD Review Time | Avg time from action creation to approval | <4 hours | Timestamp diff |
| Client NPS | Net Promoter Score from clients | >50 | Quarterly survey |
| ED Hours Saved | Self-reported weekly hours saved | 10+ | Monthly check-in |
| Runway Visibility | % of clients with live runway forecast | 100% | Dashboard check |
| Task Completion Rate | % of Director tasks completed on time | >85% | `directorTasks.status` |

### Event Tracking

| Event | Properties | Purpose |
|-------|------------|---------|
| `agent.action.created` | org_slug, agent, action_type, tool | Track agent activity |
| `agent.action.approved` | org_slug, approver, time_to_approval | Measure FDD load |
| `agent.action.executed` | org_slug, agent, success, duration | Performance |
| `client.portal.viewed` | org_slug, user, page | Engagement |
| `client.approval.given` | org_slug, action_id | Client engagement |
| `fdd.console.reviewed` | fdd_user, org_slug, actions_reviewed | FDD productivity |

---

## 12. Edge Cases & Failure Modes

| Scenario | Handling |
|----------|----------|
| QuickBooks token expires | Alert FDD, mark integration as "needs reconnect", pause Finance Director tasks |
| Agent produces incorrect output | FDD corrects in console; log correction for future training |
| Client doesn't respond to approval request | Escalate to FDD after 48 hours; mark as blocked |
| External API rate limit | Implement exponential backoff; queue tasks for retry |
| Agent task takes too long | 5-minute timeout; mark as failed; notify FDD |
| Conflicting approvals (FDD and client approve differently) | FDD approval takes precedence; notify client |
| Client data breach suspected | Immediate lockdown; notify admin; audit log review |
| Retell call fails to connect | Retry once; if fails, log and notify FDD to follow up manually |

---

## 13. Risks, Open Questions, and Out-of-Scope

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Agents make costly mistakes (e.g., wrong financial data) | Medium | High | Mandatory FDD review for P0; progressive autonomy |
| Clients don't engage with portal | Medium | Medium | Keep portal minimal; FDD proactive outreach |
| QuickBooks integration complexity | High | Medium | Start with read-only; add write operations gradually |
| FDD bandwidth becomes bottleneck | Medium | High | Track approval times; invest in autonomy features |
| Data privacy concerns | Low | High | Encryption, audit logs, clear retention policies |

### Open Questions

1. **Pricing model validation** — Are current tiers ($299-$2500/mo) viable? Need pilot feedback.
2. **Agent LLM choice** — GPT-4o vs Claude 3.5 Sonnet? Cost vs quality tradeoff.
3. **White-glove onboarding duration** — How many hours per client? Affects pricing.
4. **Multi-org ED** — Some EDs run multiple nonprofits. Support multiple orgs per user?

### Out of Scope (for this PRD)

- Mobile native app
- Self-service client onboarding
- Full CRM replacement
- White-label platform for partners
- International/non-US tax compliance

---

## 14. Release Plan

### MVP (Weeks 1-8)

**Goal**: Working agent platform with 2 Directors, client portal, FDD console

| Week | Milestone |
|------|-----------|
| 1-2 | Agent runtime infrastructure, tool framework, agentActions table |
| 3-4 | Finance Director agent (monthly close, runway), QuickBooks read integration |
| 5-6 | Client portal MVP, approval workflows |
| 7-8 | FDD console MVP, Development Director (extend debrief agent) |

**Exit criteria**:
- 2 Directors (Finance, Development) executing tasks
- Client can view activity and approve actions
- FDD can review all clients and intervene
- QuickBooks transactions syncing
- 1 pilot client live

### V1 (Weeks 9-16)

**Goal**: Full 5-Director suite, robust integrations, analytics

| Week | Milestone |
|------|-----------|
| 9-10 | Ops Director (compliance calendar, recurring tasks) |
| 11-12 | Comms Director (newsletter scheduling, social content) |
| 13-14 | ED Copilot (briefings, time tracking), report generator |
| 15-16 | Analytics dashboard, progressive autonomy, polish |

**Exit criteria**:
- 5 Directors active
- 3-5 pilot clients live
- Client analytics showing ROI
- Autonomy rate >50%

### V2 (Future)

- Program Director
- Stripe/Mailchimp integrations
- Self-service onboarding
- Agent learning from corrections

---

## 15. Epics + User Stories

### Epic 1: Agent Runtime Infrastructure

#### Goal/Outcome
Build the foundational infrastructure that allows AI Directors to execute tasks, use tools, and log all actions for audit and oversight.

#### In-Scope
- Agent execution engine (run tasks, call tools, handle errors)
- Tool registry and interface
- `agentActions` table and logging
- `agentSessions` for grouping related actions
- Basic scheduling (cron triggers)

#### Out-of-Scope
- Progressive autonomy (Epic 5)
- Specific Director implementations
- External integrations (separate epics)

#### Dependencies
- None (foundational)

#### Key Technical Notes
- Files: `lib/agents/runtime.ts`, `lib/agents/tools/base.ts`, `db/schema.ts`
- API: `POST /api/agents/run`, `GET /api/agents/actions`
- Tables: `agentActions`, `agentSessions`, `tools`, `orgToolAccess`

#### Definition of Done
- [ ] Agent can execute a task that calls a tool
- [ ] All actions logged to `agentActions` with full audit trail
- [ ] Tool interface defined and documented
- [ ] 2+ internal tools implemented (e.g., `internal.generateReport`, `internal.createTask`)
- [ ] Cron job can trigger agent tasks
- [ ] Unit tests for runtime and tool execution

#### User Stories

**Story 1.1** [BE]
> As an **agent runtime**, I want to **execute a task by calling registered tools**, so that **Directors can perform actions autonomously**.

**Acceptance Criteria**:
- Given a task with `toolId` and `input`, when the runtime executes, then the tool's `execute()` function is called with correct context
- Given a tool returns success, when execution completes, then an `agentAction` is logged with status `executed`
- Given a tool throws an error, when execution fails, then an `agentAction` is logged with status `failed` and `errorMessage`

**Priority**: P0 | **Estimate**: L | **Tags**: BE, Infra

---

**Story 1.2** [BE]
> As a **platform admin**, I want to **register tools with schemas**, so that **agents can discover and validate tool inputs**.

**Acceptance Criteria**:
- Given a tool definition with Zod schemas, when registered, then it appears in the tool registry
- Given an agent attempts to call a tool with invalid input, when validated, then execution is rejected with schema error
- Tools have `id`, `name`, `description`, `category`, `riskLevel`, `inputSchema`, `outputSchema`

**Priority**: P0 | **Estimate**: M | **Tags**: BE

---

**Story 1.3** [BE]
> As an **auditor**, I want to **query all agent actions for an org**, so that **I can review what agents have done**.

**Acceptance Criteria**:
- Given an org_slug, when I call `GET /api/agents/actions?org=hiiiwav`, then I receive all actions for that org
- Each action includes: id, agent, actionType, tool, input, output, status, timestamps, approver
- Results are paginated (default 50, max 100)
- Results can be filtered by date range, agent, status

**Priority**: P0 | **Estimate**: M | **Tags**: BE

---

**Story 1.4** [BE]
> As a **system**, I want to **trigger agent tasks on a schedule**, so that **recurring work happens automatically**.

**Acceptance Criteria**:
- Given a cron configuration (e.g., "first Monday of month"), when the time arrives, then the specified agent task is triggered
- The trigger source is logged as `cron` in `agentActions`
- If the task fails, it is retried once; if still fails, FDD is notified

**Priority**: P0 | **Estimate**: M | **Tags**: BE, Infra

---

**Story 1.5** [BE]
> As a **developer**, I want to **group related agent actions into sessions**, so that **complex workflows are traceable**.

**Acceptance Criteria**:
- Given a "monthly close" workflow with 5 steps, when executed, then all actions share a `sessionId`
- The `agentSessions` table tracks: org, agent, sessionType, status, summary, actionCount
- Sessions have status: active, completed, failed

**Priority**: P1 | **Estimate**: S | **Tags**: BE

---

### Epic 2: QuickBooks Integration

#### Goal/Outcome
Enable Finance Director to read financial data from QuickBooks Online, supporting monthly close and runway calculations.

#### In-Scope
- OAuth2 connection flow
- Read transactions, accounts, balances
- Secure token storage and refresh
- Integration health monitoring

#### Out-of-Scope
- Write operations (invoices, payments) — V1
- Bank reconciliation automation
- Multi-company support

#### Dependencies
- Epic 1 (Agent Runtime) for tool framework

#### Key Technical Notes
- Files: `lib/agents/tools/quickbooks.ts`, `app/api/integrations/quickbooks/`
- OAuth callback: `/api/integrations/quickbooks/callback`
- Tables: `orgIntegrations`
- QuickBooks API: Accounting API v3

#### Definition of Done
- [ ] FDD can connect client's QuickBooks via OAuth
- [ ] `quickbooks.getTransactions` tool returns transactions for date range
- [ ] `quickbooks.getAccounts` tool returns chart of accounts
- [ ] `quickbooks.getBalance` tool returns current balances
- [ ] Token refresh handled automatically
- [ ] Integration status visible in FDD console

#### User Stories

**Story 2.1** [Full-stack]
> As an **FDD**, I want to **connect a client's QuickBooks account**, so that **Finance Director can access their financial data**.

**Acceptance Criteria**:
- Given I'm on the client's settings page, when I click "Connect QuickBooks", then I'm redirected to QuickBooks OAuth
- Given the client approves, when redirected back, then tokens are stored securely in `orgIntegrations`
- The integration shows as "Connected" with last sync time

**Priority**: P0 | **Estimate**: L | **Tags**: Full-stack

---

**Story 2.2** [BE]
> As a **Finance Director agent**, I want to **fetch transactions for a date range**, so that **I can perform monthly close**.

**Acceptance Criteria**:
- Given a connected QuickBooks, when I call `quickbooks.getTransactions({ startDate, endDate })`, then I receive all transactions
- Each transaction includes: id, date, amount, vendor/customer, account, category
- If token is expired, it auto-refreshes; if refresh fails, integration is marked "expired"

**Priority**: P0 | **Estimate**: M | **Tags**: BE

---

**Story 2.3** [BE]
> As a **Finance Director agent**, I want to **get current account balances**, so that **I can calculate runway**.

**Acceptance Criteria**:
- Given a connected QuickBooks, when I call `quickbooks.getBalances()`, then I receive all account balances
- Includes: bank accounts, credit cards, accounts receivable, accounts payable
- Cash position calculated as sum of bank accounts minus credit card balances

**Priority**: P0 | **Estimate**: M | **Tags**: BE

---

**Story 2.4** [BE]
> As a **system**, I want to **monitor integration health**, so that **FDDs know when reconnection is needed**.

**Acceptance Criteria**:
- Given a QuickBooks integration, when token expires or API fails, then status is set to "expired" or "error"
- FDD console shows integration status for each client
- Alert is created when integration becomes unhealthy

**Priority**: P0 | **Estimate**: S | **Tags**: BE

---

### Epic 3: Finance Director Agent

#### Goal/Outcome
Implement the Finance Director agent that performs monthly close, calculates runway, and generates financial reports.

#### In-Scope
- Monthly close workflow (categorize, reconcile, report)
- Runway calculation (cash / monthly burn)
- Budget vs actuals report generation
- Anomaly detection (unusual transactions)

#### Out-of-Scope
- Audit preparation
- 990 filing support
- Restricted fund tracking

#### Dependencies
- Epic 1 (Agent Runtime)
- Epic 2 (QuickBooks Integration)

#### Key Technical Notes
- Files: `lib/agents/directors/finance.ts`, `lib/agents/tools/internal.ts`
- Reports stored in DB and/or generated as PDF
- Anomaly thresholds configurable per org

#### Definition of Done
- [ ] Finance Director can execute "monthly close" workflow
- [ ] Runway calculation accurate to within 0.1 months
- [ ] Monthly financial report generated and saved
- [ ] Anomalies flagged with clear explanations
- [ ] FDD can review and approve flagged items

#### User Stories

**Story 3.1** [BE]
> As a **Finance Director agent**, I want to **perform monthly close**, so that **books are closed by Day 10 each month**.

**Acceptance Criteria**:
- Given it's the first Monday of the month, when triggered, then Finance Director:
  1. Pulls transactions from QuickBooks
  2. Categorizes any uncategorized transactions
  3. Identifies anomalies (>$1K or >2 std dev from average)
  4. Generates monthly close report
  5. Creates approval task for FDD if anomalies found
- All steps logged as `agentActions`

**Priority**: P0 | **Estimate**: L | **Tags**: BE

---

**Story 3.2** [BE]
> As a **Finance Director agent**, I want to **calculate runway**, so that **ED always knows cash position**.

**Acceptance Criteria**:
- Given current cash balance and 3-month average expenses, when calculated, then runway = cash / average monthly burn
- Runway is updated weekly (or on-demand)
- If runway < 6 months, alert is created for FDD
- Runway trend (improving/stable/declining) calculated from last 3 readings

**Priority**: P0 | **Estimate**: M | **Tags**: BE

---

**Story 3.3** [BE]
> As a **Finance Director agent**, I want to **generate budget vs actuals report**, so that **ED can see spending variance**.

**Acceptance Criteria**:
- Given a budget (stored in DB) and actuals from QuickBooks, when generated, then report shows:
  - Each budget line item
  - Actual spend YTD
  - Variance ($ and %)
  - Traffic light indicator (green/yellow/red)
- Report saved as JSON and PDF

**Priority**: P1 | **Estimate**: M | **Tags**: BE

---

**Story 3.4** [Full-stack]
> As an **FDD**, I want to **review flagged transactions**, so that **I can verify or correct categorization**.

**Acceptance Criteria**:
- Given Finance Director flagged 3 transactions, when I view in FDD console, then I see each with:
  - Transaction details
  - Why it was flagged
  - Suggested category
  - Actions: [Approve] [Change Category] [Add Note]
- My decision is logged in `agentActions`

**Priority**: P0 | **Estimate**: M | **Tags**: Full-stack

---

### Epic 4: Client Portal

#### Goal/Outcome
Build minimal, output-focused portal where nonprofit EDs see what Directors have done and approve high-risk actions.

#### In-Scope
- Activity feed (recent agent actions)
- Pending approvals (with preview and action buttons)
- Reports viewer (financial, impact)
- Chat interface with Directors
- Key metrics display (runway, donor touches, etc.)

#### Out-of-Scope
- Full CRM functionality
- Document editing
- Complex dashboards
- Mobile app

#### Dependencies
- Epic 1 (Agent Runtime) for action data
- Epic 3 (Finance Director) for reports

#### Key Technical Notes
- Routes: `app/(client)/[orgSlug]/portal/`
- Components: ActivityFeed, ApprovalCard, ReportViewer, ChatPanel
- API: `GET /api/client/[orgSlug]/activity`, `POST /api/client/[orgSlug]/approve`

#### Definition of Done
- [ ] ED can log in and see their org's portal
- [ ] Activity feed shows last 7 days of Director work
- [ ] ED can approve/reject pending actions
- [ ] Reports are viewable (PDF and web)
- [ ] Chat interface connects to Directors (via AI)
- [ ] Key metrics displayed accurately

#### User Stories

**Story 4.1** [FE]
> As an **ED**, I want to **see what my Directors did this week**, so that **I know work is happening without me**.

**Acceptance Criteria**:
- Given I log into the portal, when the dashboard loads, then I see activity feed with:
  - Last 7 days of completed actions
  - Grouped by day
  - Each showing: Director name, action summary, timestamp
- Actions are shown in reverse chronological order

**Priority**: P0 | **Estimate**: M | **Tags**: FE

---

**Story 4.2** [Full-stack]
> As an **ED**, I want to **approve or reject pending actions**, so that **high-risk work requires my sign-off**.

**Acceptance Criteria**:
- Given there's a pending approval (e.g., draft email to funder), when I view it, then I see:
  - Full preview of the action/content
  - [Approve] [Edit & Approve] [Reject] buttons
- When I approve, the action is marked approved and executed
- When I reject, the action is marked rejected with my reason

**Priority**: P0 | **Estimate**: M | **Tags**: Full-stack

---

**Story 4.3** [FE]
> As an **ED**, I want to **view my financial reports**, so that **I can see runway and spending**.

**Acceptance Criteria**:
- Given Finance Director generated January report, when I click "View Report", then:
  - Web version shows key metrics, charts, breakdown
  - PDF download available
- Reports list shows all available reports with dates

**Priority**: P0 | **Estimate**: M | **Tags**: FE

---

**Story 4.4** [Full-stack]
> As an **ED**, I want to **chat with my Directors**, so that **I can ask questions and give instructions**.

**Acceptance Criteria**:
- Given I open the chat panel, when I type a question, then:
  - Response comes from appropriate Director (AI-powered)
  - If question requires action, a task is created
  - Conversation history is saved
- Response time < 10 seconds for most queries

**Priority**: P1 | **Estimate**: L | **Tags**: Full-stack

---

**Story 4.5** [FE]
> As an **ED**, I want to **see key metrics at a glance**, so that **I know my org's health**.

**Acceptance Criteria**:
- Given I view the dashboard, when loaded, then I see:
  - Runway (months, with trend arrow)
  - Donor touches this month (vs goal)
  - Tasks completed / pending
  - Comms cadence (newsletters, social)
- Metrics update when underlying data changes

**Priority**: P1 | **Estimate**: S | **Tags**: FE

---

### Epic 5: FDD Console

#### Goal/Outcome
Build power-user console for Forward Deployed Directors to manage multiple clients, review actions, and intervene when needed.

#### In-Scope
- Multi-client dashboard (health overview)
- Per-client drill-down (actions, reports, integrations)
- Approval queue (all pending across clients)
- Intervention tools (take over, correct, escalate)
- Client communication (portal chat)

#### Out-of-Scope
- Billing management
- Platform admin (separate admin routes)
- Client onboarding wizard

#### Dependencies
- Epic 1 (Agent Runtime)
- Epic 4 (Client Portal) for shared components

#### Key Technical Notes
- Routes: `app/(fdd)/dashboard/`, `app/(fdd)/clients/[orgSlug]/`, `app/(fdd)/reviews/`
- API: `GET /api/fdd/clients`, `GET /api/fdd/reviews`, `POST /api/fdd/approve`
- Role check: user.role === 'fdd' or 'admin'

#### Definition of Done
- [ ] FDD can see all assigned clients at a glance
- [ ] Health status (green/yellow/red) calculated per client
- [ ] Pending reviews shown in unified queue
- [ ] FDD can approve/reject/modify actions
- [ ] FDD can message client via portal chat
- [ ] Integration status visible per client

#### User Stories

**Story 5.1** [FE]
> As an **FDD**, I want to **see all my clients' health at a glance**, so that **I know who needs attention**.

**Acceptance Criteria**:
- Given I open FDD console, when dashboard loads, then I see all assigned clients with:
  - Client name
  - Health indicator (green/yellow/red)
  - Runway (if Finance Director active)
  - Integration status
  - Pending reviews count
- Clients needing attention appear at top

**Priority**: P0 | **Estimate**: M | **Tags**: FE

---

**Story 5.2** [Full-stack]
> As an **FDD**, I want to **review and approve pending actions across all clients**, so that **I can efficiently manage my workload**.

**Acceptance Criteria**:
- Given multiple clients have pending approvals, when I view `/fdd/reviews`, then I see unified queue
- Each item shows: client, Director, action type, preview, age
- I can [Approve] [Reject] [View Details] for each
- I can filter by client, Director, action type

**Priority**: P0 | **Estimate**: M | **Tags**: Full-stack

---

**Story 5.3** [Full-stack]
> As an **FDD**, I want to **drill into a specific client**, so that **I can see their full context**.

**Acceptance Criteria**:
- Given I click on HiiiWAV in the dashboard, when the client view loads, then I see:
  - All Directors and their current status
  - Recent actions (last 30 days)
  - Pending tasks and approvals
  - Integration health
  - Chat history
- I can take actions on any item

**Priority**: P0 | **Estimate**: M | **Tags**: Full-stack

---

**Story 5.4** [Full-stack]
> As an **FDD**, I want to **correct an agent's output**, so that **the agent improves over time**.

**Acceptance Criteria**:
- Given Finance Director miscategorized a transaction, when I correct it, then:
  - My correction is applied
  - Original output and correction are logged
  - (Future) Correction is used for agent training

**Priority**: P1 | **Estimate**: M | **Tags**: Full-stack

---

**Story 5.5** [Full-stack]
> As an **FDD**, I want to **manually trigger an agent task**, so that **I can run workflows on demand**.

**Acceptance Criteria**:
- Given I'm in client view, when I click "Run Task", then I can:
  - Select Director
  - Select task type (e.g., "monthly close", "donor outreach")
  - Optionally provide parameters
- Task executes and results appear in action log

**Priority**: P1 | **Estimate**: M | **Tags**: Full-stack

---

### Epic 6: Development Director Agent

#### Goal/Outcome
Extend the existing meeting debrief agent into a full Development Director that manages donor relationships, follow-ups, and pipeline.

#### In-Scope
- Meeting debrief (extend existing)
- Follow-up email drafting
- Donor pipeline tracking (CRM-lite)
- Relationship health scoring

#### Out-of-Scope
- Full CRM replacement
- Grant writing
- Event management

#### Dependencies
- Epic 1 (Agent Runtime)
- Existing Retell/Google Docs integration

#### Key Technical Notes
- Files: `lib/agents/directors/development.ts`, extend `lib/retell.ts`
- Uses existing `debriefCalls` table
- New `parties` table for donor tracking

#### Definition of Done
- [ ] Meeting debrief captures all key info
- [ ] Follow-up emails auto-drafted and queued for approval
- [ ] Donor relationships tracked with last touch date
- [ ] Relationship health visible in portal and console

#### User Stories

**Story 6.1** [BE]
> As a **Development Director agent**, I want to **draft follow-up emails after meetings**, so that **ED doesn't have to write them**.

**Acceptance Criteria**:
- Given a debrief was captured, when processed, then Development Director:
  - Drafts personalized thank-you/follow-up email
  - References specific meeting topics
  - Includes any commitments or next steps
  - Queues for ED/FDD approval
- Email is not sent until approved

**Priority**: P0 | **Estimate**: M | **Tags**: BE

---

**Story 6.2** [BE]
> As a **Development Director agent**, I want to **track donor relationships**, so that **we never lose touch with key supporters**.

**Acceptance Criteria**:
- Given a party is tagged as "donor", when tracking, then we record:
  - Last touch date
  - Touch type (meeting, email, event)
  - Relationship tier (major, mid, prospect)
  - Next action recommended
- Donors with no touch in 90 days are flagged

**Priority**: P0 | **Estimate**: M | **Tags**: BE

---

**Story 6.3** [Full-stack]
> As an **ED**, I want to **see my donor pipeline**, so that **I know who to focus on**.

**Acceptance Criteria**:
- Given I view Development Director section in portal, when loaded, then I see:
  - Top 20 donors with last touch and next action
  - Donors at risk (no touch in 90 days)
  - Upcoming meetings/calls
- I can click through to donor details

**Priority**: P1 | **Estimate**: M | **Tags**: Full-stack

---

### Epic 7: Approval Workflow System

#### Goal/Outcome
Build robust approval workflow that routes high-risk actions to appropriate approvers (FDD or client) based on configurable rules.

#### In-Scope
- Approval rules engine (per org, per tool, per action type)
- Approval routing (FDD vs client)
- Approval UI in portal and console
- Timeout and escalation

#### Out-of-Scope
- Multi-level approvals (single approver for MVP)
- Conditional approval chains

#### Dependencies
- Epic 1 (Agent Runtime)
- Epic 4 (Client Portal)
- Epic 5 (FDD Console)

#### Key Technical Notes
- Tables: extend `agentActions`, add `approvalRules`
- API: `POST /api/approvals/[actionId]/approve`
- Rules stored per org in `orgToolAccess.requiresApproval`

#### Definition of Done
- [ ] High-risk actions automatically routed for approval
- [ ] Approvers notified (email or portal)
- [ ] Approvers can approve/reject with comments
- [ ] Actions execute only after approval
- [ ] Timeout escalation after 48 hours

#### User Stories

**Story 7.1** [BE]
> As a **system**, I want to **route high-risk actions for approval**, so that **sensitive operations require human oversight**.

**Acceptance Criteria**:
- Given an action has `requiresApproval: true`, when created, then:
  - Status is set to "pending"
  - Approver(s) are determined by rules
  - Action is NOT executed
- When approved, status becomes "approved" then "executed"

**Priority**: P0 | **Estimate**: M | **Tags**: BE

---

**Story 7.2** [Full-stack]
> As an **FDD**, I want to **configure approval rules per client**, so that **I can adjust oversight levels**.

**Acceptance Criteria**:
- Given I'm in client settings, when I configure rules, then I can set:
  - Which tools require approval
  - Who approves (FDD only, client, or either)
  - Dollar thresholds for financial actions
- Changes take effect immediately

**Priority**: P1 | **Estimate**: M | **Tags**: Full-stack

---

**Story 7.3** [BE]
> As a **system**, I want to **escalate stale approvals**, so that **nothing gets stuck forever**.

**Acceptance Criteria**:
- Given an action is pending for 48 hours, when timeout triggers, then:
  - FDD is notified
  - Action is marked "stale"
  - If still stale after 7 days, auto-reject

**Priority**: P1 | **Estimate**: S | **Tags**: BE

---

### Epic 8: Operations Director Agent (V1)

#### Goal/Outcome
Implement Operations Director to manage compliance calendar, recurring tasks, and vendor contracts.

#### In-Scope
- Compliance calendar (filings, deadlines)
- Recurring task management
- Vendor/contract tracking
- Deadline alerts

#### Out-of-Scope
- HR management
- Insurance renewals
- Full project management

#### Dependencies
- Epic 1 (Agent Runtime)

#### Key Technical Notes
- Files: `lib/agents/directors/operations.ts`
- Use existing `directorTasks` table
- Add `complianceDeadlines`, `contracts` tables

#### Definition of Done
- [ ] Compliance calendar populated with standard nonprofit deadlines
- [ ] Ops Director creates tasks for upcoming deadlines
- [ ] Recurring tasks auto-created on schedule
- [ ] Contract expiration alerts sent

#### User Stories

**Story 8.1** [Full-stack]
> As an **Ops Director agent**, I want to **track compliance deadlines**, so that **the org never misses a filing**.

**Acceptance Criteria**:
- Given standard nonprofit deadlines (990, state filings, etc.), when configured, then:
  - Deadlines appear in compliance calendar
  - Tasks created 30/14/7 days before due
  - FDD alerted if tasks not completed
- Custom deadlines can be added

**Priority**: P1 | **Estimate**: M | **Tags**: Full-stack

---

**Story 8.2** [BE]
> As an **Ops Director agent**, I want to **manage recurring tasks**, so that **routine work happens automatically**.

**Acceptance Criteria**:
- Given a recurring task (e.g., "payroll every 2 weeks"), when due, then:
  - Task is created in `directorTasks`
  - Assigned to appropriate Director or person
  - Reminder sent if not completed by due date

**Priority**: P1 | **Estimate**: M | **Tags**: BE

---

### Epic 9: Communications Director Agent (V1)

#### Goal/Outcome
Implement Communications Director to manage newsletter scheduling, social content, and story library.

#### In-Scope
- Newsletter content calendar
- Social post scheduling
- Story/content library
- Engagement analytics (basic)

#### Out-of-Scope
- Full email marketing platform
- Ad management
- Video production

#### Dependencies
- Epic 1 (Agent Runtime)
- Email integration (Resend or Mailchimp)

#### Key Technical Notes
- Files: `lib/agents/directors/communications.ts`
- Add `contentCalendar`, `contentLibrary` tables
- Integrate with Resend for email sending

#### Definition of Done
- [ ] Newsletter content drafted monthly
- [ ] Social posts suggested weekly
- [ ] Content library populated with org stories
- [ ] Basic analytics tracked (opens, clicks, engagement)

#### User Stories

**Story 9.1** [Full-stack]
> As a **Comms Director agent**, I want to **draft monthly newsletter**, so that **donors stay engaged**.

**Acceptance Criteria**:
- Given it's newsletter time, when triggered, then Comms Director:
  - Gathers recent activities, stories, events
  - Drafts newsletter content
  - Queues for ED/FDD review
- Newsletter can be edited before sending

**Priority**: P1 | **Estimate**: L | **Tags**: Full-stack

---

**Story 9.2** [Full-stack]
> As a **Comms Director agent**, I want to **suggest social posts**, so that **org has consistent presence**.

**Acceptance Criteria**:
- Given content calendar, when weekly planning runs, then:
  - 3-5 post ideas generated
  - Each with draft copy and suggested image
  - ED can approve, edit, or reject
- Approved posts added to schedule

**Priority**: P1 | **Estimate**: M | **Tags**: Full-stack

---

### Epic 10: Analytics & Reporting

#### Goal/Outcome
Build analytics to prove ROI to clients and track platform health.

#### In-Scope
- Client dashboard metrics
- FDD productivity metrics
- Agent performance metrics
- Report generation (impact reports, board packets)

#### Out-of-Scope
- Real-time dashboards
- External analytics tools
- A/B testing

#### Dependencies
- Epic 1 (Agent Runtime) for action data
- Epic 4 (Client Portal) for display

#### Key Technical Notes
- Files: `lib/analytics/`, components in `components/analytics/`
- Store aggregated metrics in `directorMetrics` table
- Use Vercel Analytics for basic tracking

#### Definition of Done
- [ ] Client sees key metrics in portal
- [ ] FDD sees productivity metrics in console
- [ ] Agent performance (execution time, error rate) tracked
- [ ] Impact report can be generated on demand

#### User Stories

**Story 10.1** [Full-stack]
> As an **ED**, I want to **see my time savings**, so that **I know Director OS is worth it**.

**Acceptance Criteria**:
- Given 30 days of activity, when I view analytics, then I see:
  - Estimated hours saved (based on task types)
  - Tasks completed by Directors
  - Comparison to before Director OS

**Priority**: P1 | **Estimate**: M | **Tags**: Full-stack

---

**Story 10.2** [BE]
> As a **platform admin**, I want to **track agent performance**, so that **I can optimize and debug**.

**Acceptance Criteria**:
- Given agent actions, when I view admin analytics, then I see:
  - Execution time (p50, p95, p99)
  - Error rate by agent/tool
  - Approval rate over time
  - Most used tools

**Priority**: P1 | **Estimate**: M | **Tags**: BE

---

### Epic 11: Progressive Autonomy (V1)

#### Goal/Outcome
Build system that tracks agent trustworthiness and gradually reduces required approvals.

#### In-Scope
- Track approval outcomes (approved/rejected/corrected)
- Calculate trust score per org per agent
- Auto-adjust approval requirements
- FDD override capability

#### Out-of-Scope
- Machine learning for trust
- Fully autonomous mode (always some oversight)

#### Dependencies
- Epic 1 (Agent Runtime)
- Epic 7 (Approval Workflow)

#### Key Technical Notes
- Add `trustScore` to org/agent config
- Trust score: 0-100 based on recent approval outcomes
- Rules: score >80 → reduce approvals; score <50 → increase

#### Definition of Done
- [ ] Trust score calculated per org per agent
- [ ] Approval requirements auto-adjust based on score
- [ ] FDD can view and override trust level
- [ ] Score visible in FDD console

#### User Stories

**Story 11.1** [BE]
> As a **system**, I want to **calculate trust scores**, so that **reliable agents need less oversight**.

**Acceptance Criteria**:
- Given 30 days of approvals, when calculated, then trust score reflects:
  - % approved without changes: +points
  - % approved with changes: neutral
  - % rejected: -points
  - Recent actions weighted more heavily

**Priority**: P2 | **Estimate**: M | **Tags**: BE

---

**Story 11.2** [Full-stack]
> As an **FDD**, I want to **see and adjust trust levels**, so that **I can manage autonomy**.

**Acceptance Criteria**:
- Given I view client settings, when I see trust scores, then:
  - Score shown per Director
  - Current approval threshold shown
  - I can manually override (increase/decrease)
  - Override is logged

**Priority**: P2 | **Estimate**: S | **Tags**: Full-stack

---

### Epic 12: ED Copilot Agent (V1)

#### Goal/Outcome
Implement Executive Director Copilot that coordinates other Directors, manages ED time, and prepares briefings.

#### In-Scope
- Weekly ED briefing (summary from all Directors)
- Calendar/time analysis
- Board meeting prep
- Director coordination

#### Out-of-Scope
- Personal assistant features
- External meeting scheduling
- Full strategy planning

#### Dependencies
- Epic 1 (Agent Runtime)
- Epics 3, 6, 8, 9 (Other Directors)

#### Key Technical Notes
- Files: `lib/agents/directors/executive.ts`
- Aggregates data from other Directors
- Uses Google Calendar for time analysis

#### Definition of Done
- [ ] Weekly briefing generated automatically
- [ ] ED time allocation analyzed
- [ ] Board meeting materials aggregated
- [ ] ED can ask questions about any Director's domain

#### User Stories

**Story 12.1** [BE]
> As an **ED Copilot**, I want to **generate weekly briefings**, so that **ED starts each week informed**.

**Acceptance Criteria**:
- Given Monday morning, when triggered, then ED Copilot:
  - Aggregates highlights from all Directors
  - Identifies urgent items needing attention
  - Summarizes key metrics
  - Creates "This Week" action items
- Briefing delivered via portal and optional email

**Priority**: P1 | **Estimate**: M | **Tags**: BE

---

**Story 12.2** [Full-stack]
> As an **ED**, I want to **see how I spend my time**, so that **I can prioritize better**.

**Acceptance Criteria**:
- Given Google Calendar access, when analyzed, then ED sees:
  - Time breakdown by category (fundraising, internal, admin)
  - Comparison to goals ("60% external-facing")
  - Suggestions for improvement

**Priority**: P2 | **Estimate**: M | **Tags**: Full-stack

---

## 16. Verification Checklist

### PRD Requirements → Epics → Stories Mapping

| PRD Requirement | Epic | Stories | Status |
|-----------------|------|---------|--------|
| F1: Agent Runtime | Epic 1 | 1.1-1.5 | ✓ Covered |
| F2: Tool Framework | Epic 1 | 1.2 | ✓ Covered |
| F3: agentActions Audit | Epic 1 | 1.3 | ✓ Covered |
| F4: Client Portal | Epic 4 | 4.1-4.5 | ✓ Covered |
| F5: FDD Console | Epic 5 | 5.1-5.5 | ✓ Covered |
| F6: Finance Director | Epic 3 | 3.1-3.4 | ✓ Covered |
| F7: Development Director | Epic 6 | 6.1-6.3 | ✓ Covered |
| F8: QuickBooks Integration | Epic 2 | 2.1-2.4 | ✓ Covered |
| F9: Google Calendar/Docs | (Existing) | - | ✓ Exists |
| F10: Approval Workflow | Epic 7 | 7.1-7.3 | ✓ Covered |
| F11: Operations Director | Epic 8 | 8.1-8.2 | ✓ Covered |
| F12: Communications Director | Epic 9 | 9.1-9.2 | ✓ Covered |
| F13: ED Copilot | Epic 12 | 12.1-12.2 | ✓ Covered |
| F14: Progressive Autonomy | Epic 11 | 11.1-11.2 | ✓ Covered |
| F15: Email Tool | Epic 6 | 6.1 | ✓ Covered |
| F16: Report Generator | Epic 10 | Implied | ⚠️ Needs story |
| F17: Client Analytics | Epic 10 | 10.1-10.2 | ✓ Covered |

### Gaps Identified

1. **Report Generator** — No explicit story for generating impact reports, board packets, annual reports. Add to Epic 10.

2. **Onboarding Flow** — No epic for FDD onboarding a new client. Could be a separate epic or part of Epic 5.

3. **Notification System** — No explicit story for email/push notifications when approvals are needed. Add to Epic 7.

4. **Error Handling** — Stories reference error states but no explicit story for system-wide error handling. Consider adding.

5. **Testing & QA** — No QA stories. Add acceptance testing stories to each epic.

---

## Summary

This PRD defines **DirectorforGood** as an AI agent platform providing fractional director services to nonprofits. The MVP focuses on:

- **2 Directors** (Finance, Development) with full workflows
- **Client Portal** for EDs to see work and approve actions
- **FDD Console** for human oversight
- **QuickBooks integration** for financial data
- **Approval workflow** for safety

The 12 Epics and 40+ User Stories provide a complete roadmap from MVP through V1/V2, with clear acceptance criteria and dependencies.

**Next steps**:
1. Validate assumptions with stakeholders
2. Prioritize stories within each epic
3. Begin Sprint 1 with Epic 1 (Agent Runtime) + Epic 2 (QuickBooks)
