---
name: DirectorforGood Architecture
overview: An agent platform architecture for DirectorforGood.org that delivers AI agents (Directors) as fractional staff services to nonprofits. The agents use internal and external tools on behalf of clients, evolving from human-assisted to fully autonomous operations.
todos:
  - id: agent-runtime
    content: Build agent runtime infrastructure with tool registry, execution engine, and audit logging
    status: pending
  - id: tool-framework
    content: Create standardized Tool interface for both internal (DB, reports) and external (QuickBooks, email) tools
    status: pending
  - id: agent-activity-log
    content: Add agentActions table to track every action agents take (for audit, debugging, and client transparency)
    status: pending
  - id: client-portal
    content: Build minimal client portal for viewing agent work output, approving actions, and chatting with Directors
    status: pending
  - id: operator-console
    content: Create internal FDD (Forward Deployed Director) console for human oversight and intervention
    status: pending
  - id: quickbooks-tool
    content: Implement QuickBooks tool that Finance Director agent can use to read/write accounting data
    status: pending
---

# DirectorforGood.org Agent Platform Architecture

## Executive Summary

DirectorforGood is an **agent platform**, not traditional SaaS. We provide AI agents (the Six Directors) that work as fractional staff for nonprofit organizations. The agents use tools - both our internal software and clients' external systems - to do actual work on the client's behalf.**Key distinction:**

- **SaaS**: "Here's software, you use it"
- **Agent Platform**: "Here's an agent, it uses software for you"

**Evolution path:**

1. **Now**: Human FDD (Forward Deployed Director) + AI agent working together
2. **Near-term**: Agent does most work, human reviews and approves
3. **Future**: Fully autonomous agents with human escalation only when needed

---

## 1. Core Philosophy: Agents as Service Providers

### 1.1 The Mental Model

```javascript
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT ORGANIZATION                         │
│                        (e.g., HiiiWAV)                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    CLIENT'S SYSTEMS                         ││
│  │  QuickBooks  │  Google Workspace  │  Stripe  │  Mailchimp   ││
│  └──────────────┴──────────────────┴──────────┴────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ OAuth / API Access
                              │ (Agent has delegated authority)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DIRECTORFORGOOD PLATFORM                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    AI DIRECTOR AGENTS                        ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        ││
│  │  │ Finance  │ │Developmt │ │   Ops    │ │  Comms   │        ││
│  │  │ Director │ │ Director │ │ Director │ │ Director │        ││
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘        ││
│  │       │            │            │            │               ││
│  │       └────────────┴────────────┴────────────┘               ││
│  │                         │                                    ││
│  │                    TOOL LAYER                                ││
│  │  ┌──────────────────────────────────────────────────────────┐││
│  │  │ Internal Tools    │    External Tool Connectors          │││
│  │  │ - Database CRUD   │    - QuickBooks API                  │││
│  │  │ - Report Gen      │    - Google Calendar API             │││
│  │  │ - Email Draft     │    - Stripe API                      │││
│  │  │ - PDF Export      │    - Mailchimp API                   │││
│  │  └──────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                 HUMAN OVERSIGHT LAYER                        ││
│  │  ┌──────────────────┐  ┌──────────────────┐                 ││
│  │  │  FDD Console     │  │  Client Portal   │                 ││
│  │  │  (Our Staff)     │  │  (Their ED)      │                 ││
│  │  │  - Review work   │  │  - View reports  │                 ││
│  │  │  - Approve acts  │  │  - Approve asks  │                 ││
│  │  │  - Intervene     │  │  - Chat w/agent  │                 ││
│  │  └──────────────────┘  └──────────────────┘                 ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```



### 1.2 Service Model, Not Software Model

We're selling **fractional director services**, not software subscriptions:| Traditional SaaS | DirectorforGood Agent Platform ||-----------------|--------------------------------|| "QuickBooks subscription: $30/mo" | "Fractional CFO service: $500/mo" || Client logs in and does work | Agent does work, client reviews || Client learns the software | Client just sees results || Software is the product | Agent work output is the product |---

## 2. The Six Directors

| Director | Mission | Key Tools ||----------|---------|-----------|| **Finance Director** | Keep books clean, runway visible, compliance on track | QuickBooks, bank reconciliation, runway calculator, 990 prep || **Development Director** | Grow revenue through relationships | CRM, donor pipeline, grant tracker, meeting prep || **Operations Director** | Keep the org running smoothly | Compliance calendar, vendor management, HR tools || **Communications Director** | Tell the org's story consistently | Email, social scheduling, impact reports, content library || **Program Director** | Track and report program outcomes | Participant tracking, outcomes measurement, grant reporting || **Executive Director (ED Copilot)** | Help the real ED manage other Directors and strategic work | Director coordination, strategy docs, board prep, time protection |The **Executive Director agent** is special - it:

- Coordinates the other 5 Directors
- Prepares the real-life ED's briefings and board materials
- Protects the ED's time by filtering and prioritizing
- Handles strategic planning and OKR tracking
- Escalates issues from other Directors that need human judgment

---

## 3. Agent Architecture

### 3.1 Agent Runtime Design

Each Director is an autonomous agent with:

- **Mission**: What it's responsible for
- **Tools**: What actions it can take
- **Memory**: Context about the org and past work
- **Judgment**: When to act vs. when to ask
```typescript
// lib/agents/types.ts
interface AgentContext {
  orgSlug: string;
  agentSlug: string;        // 'finance' | 'development' | 'ops' | 'comms' | 'program' | 'executive'
  
  // What this agent can access
  tools: Tool[];
  integrations: Integration[];
  
  // Memory and context
  orgProfile: OrgProfile;
  recentActions: AgentAction[];
  pendingTasks: Task[];
  
  // Oversight settings
  autonomyLevel: 'supervised' | 'semi-autonomous' | 'autonomous';
  requiresApproval: string[];  // Action types that need human sign-off
}

interface AgentAction {
  id: string;
  agentSlug: string;
  actionType: string;       // 'read_quickbooks' | 'send_email' | 'generate_report' | etc.
  toolUsed: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  status: 'pending' | 'approved' | 'executed' | 'failed' | 'rejected';
  requiresApproval: boolean;
  approvedBy?: string;      // User ID or 'auto'
  executedAt?: Date;
  createdAt: Date;
}
```




### 2.2 Tool Framework

Tools are the agent's hands. Every action goes through the tool layer:

```typescript
// lib/agents/tools/base.ts
interface Tool {
  id: string;
  name: string;
  description: string;      // For agent to understand when to use
  category: 'internal' | 'external';
  
  // What this tool needs
  requiredIntegrations?: string[];  // e.g., ['quickbooks']
  requiredPermissions?: string[];
  
  // Schema for input/output (for type safety and audit)
  inputSchema: ZodSchema;
  outputSchema: ZodSchema;
  
  // Execution
  execute(ctx: AgentContext, input: unknown): Promise<ToolResult>;
  
  // Risk assessment
  riskLevel: 'read-only' | 'low' | 'medium' | 'high';
  requiresApproval: boolean;
}

interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  sideEffects?: string[];   // "Created invoice #1234", "Sent email to donor@example.com"
}
```



### 2.3 Example: Finance Director Agent Flow

```javascript
┌─────────────────────────────────────────────────────────────┐
│           FINANCE DIRECTOR: Monthly Close Workflow           │
└─────────────────────────────────────────────────────────────┘

1. TRIGGER: First Monday of month (cron) or FDD request

2. AGENT THINKS:
   "It's time for monthly close. I need to:
    - Pull latest transactions from QuickBooks
    - Reconcile bank accounts
    - Calculate runway
    - Generate board report
    - Alert FDD if issues found"

3. AGENT USES TOOLS:
   ┌─────────────────────────────────────────────────────────┐
   │ Tool: quickbooks.getTransactions                        │
   │ Input: { startDate: '2025-01-01', endDate: '2025-01-31'}│
   │ Risk: read-only                                         │
   │ Approval: not required                                  │
   │ Output: [{ date, amount, vendor, category }, ...]       │
   └─────────────────────────────────────────────────────────┘
   
   ┌─────────────────────────────────────────────────────────┐
   │ Tool: internal.calculateRunway                          │
   │ Input: { cashBalance: 125000, monthlyBurn: 18000 }      │
   │ Risk: read-only                                         │
   │ Output: { runwayMonths: 6.9, trend: 'stable' }          │
   └─────────────────────────────────────────────────────────┘
   
   ┌─────────────────────────────────────────────────────────┐
   │ Tool: internal.generateReport                           │
   │ Input: { type: 'monthly-finance', data: {...} }         │
   │ Risk: low (creates artifact, no external action)        │
   │ Output: { reportUrl: '/reports/hiiiwav/2025-01/finance'}│
   └─────────────────────────────────────────────────────────┘
   
   ┌─────────────────────────────────────────────────────────┐
   │ Tool: internal.notifyFDD                                │
   │ Input: { message: 'Monthly close complete', urgent: no }│
   │ Risk: low                                               │
   │ Output: { notificationSent: true }                      │
   └─────────────────────────────────────────────────────────┘

4. ALL ACTIONS LOGGED:
   → agentActions table captures every step
   → FDD can review, client can see summary
```

---

## 3. Autonomy Levels and Human Oversight

### 3.1 Progressive Autonomy

Agents start supervised and earn autonomy:| Level | Description | When | Example ||-------|-------------|------|---------|| **Supervised** | Human reviews every action before execution | New client, high-risk actions | "Agent drafted email to major donor - FDD reviews before send" || **Semi-autonomous** | Agent executes low-risk, human approves high-risk | Established client | "Agent syncs QuickBooks (auto), drafts grant report (needs approval)" || **Autonomous** | Agent executes most actions, escalates edge cases | Mature relationship | "Agent manages full monthly close, only flags anomalies" |

```typescript
// lib/agents/autonomy.ts
interface AutonomyRules {
  orgSlug: string;
  agentSlug: string;
  
  // Default level
  defaultLevel: 'supervised' | 'semi-autonomous' | 'autonomous';
  
  // Override rules by action type
  actionOverrides: {
    [actionType: string]: {
      requiresApproval: boolean;
      approvers: ('fdd' | 'client_ed' | 'auto')[];
      maxAutoApprovalAmount?: number;  // For financial actions
    };
  };
}

// Example for Finance Director
const financeAutonomyRules: AutonomyRules = {
  orgSlug: 'hiiiwav',
  agentSlug: 'finance',
  defaultLevel: 'semi-autonomous',
  actionOverrides: {
    'read_quickbooks': { requiresApproval: false, approvers: ['auto'] },
    'generate_report': { requiresApproval: false, approvers: ['auto'] },
    'create_invoice': { requiresApproval: true, approvers: ['fdd', 'client_ed'] },
    'send_payment': { requiresApproval: true, approvers: ['client_ed'], maxAutoApprovalAmount: 0 },
    'categorize_transaction': { requiresApproval: false, approvers: ['auto'] },
    'flag_anomaly': { requiresApproval: false, approvers: ['auto'] },
  }
};
```



### 3.2 Approval Workflows

```javascript
┌─────────────────────────────────────────────────────────────┐
│              ACTION APPROVAL FLOW                            │
└─────────────────────────────────────────────────────────────┘

Agent wants to: Send thank-you email to major donor

1. Agent creates action:
   { actionType: 'send_email', riskLevel: 'medium', ... }

2. System checks autonomy rules:
   → 'send_email' requires approval from ['fdd']

3. Action queued in pendingApprovals:
   → FDD sees in their console
   → Can approve, reject, or modify

4. If approved:
   → Agent executes via email tool
   → Action logged as executed

5. If rejected:
   → Agent notified with reason
   → Agent may try alternative approach
```

---

## 4. Data Model for Agent Platform

### 4.1 Core Agent Tables

```typescript
// Agent actions audit log (CRITICAL for agent platform)
export const agentActions = pgTable('agent_actions', {
  id: serial('id').primaryKey(),
  orgSlug: text('org_slug').notNull(),
  agentSlug: text('agent_slug').notNull(),  // 'finance' | 'development' | etc.
  
  // What the agent did
  actionType: text('action_type').notNull(),
  toolUsed: text('tool_used').notNull(),
  inputData: jsonb('input_data'),
  outputData: jsonb('output_data'),
  
  // Approval tracking
  requiresApproval: boolean('requires_approval').default(false),
  status: text('status').default('pending'),  // 'pending' | 'approved' | 'executed' | 'failed' | 'rejected'
  approvedBy: text('approved_by'),
  approvedAt: timestamp('approved_at'),
  rejectionReason: text('rejection_reason'),
  
  // Execution
  executedAt: timestamp('executed_at'),
  errorMessage: text('error_message'),
  sideEffects: jsonb('side_effects').$type<string[]>(),
  
  // Context
  triggerSource: text('trigger_source'),  // 'cron' | 'fdd_request' | 'client_request' | 'agent_initiative'
  parentActionId: integer('parent_action_id'),  // For action chains
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tool registry
export const tools = pgTable('tools', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),  // 'internal' | 'external'
  
  // Which integrations this tool needs
  requiredIntegrations: jsonb('required_integrations').$type<string[]>(),
  
  // Risk and approval settings
  riskLevel: text('risk_level').default('read-only'),
  defaultRequiresApproval: boolean('default_requires_approval').default(false),
  
  // Schema (for validation and UI generation)
  inputSchema: jsonb('input_schema'),
  outputSchema: jsonb('output_schema'),
  
  enabled: boolean('enabled').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Org-specific tool permissions and integrations
export const orgToolAccess = pgTable('org_tool_access', {
  id: serial('id').primaryKey(),
  orgSlug: text('org_slug').notNull(),
  toolId: text('tool_id').notNull(),
  
  enabled: boolean('enabled').default(true),
  requiresApproval: boolean('requires_approval'),  // Override default
  approvers: jsonb('approvers').$type<string[]>(),
  
  // For external tools, link to integration
  integrationId: integer('integration_id').references(() => orgIntegrations.id),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Agent work sessions (for grouping related actions)
export const agentSessions = pgTable('agent_sessions', {
  id: serial('id').primaryKey(),
  orgSlug: text('org_slug').notNull(),
  agentSlug: text('agent_slug').notNull(),
  
  sessionType: text('session_type'),  // 'monthly_close' | 'donor_outreach' | 'compliance_check'
  status: text('status').default('active'),
  
  summary: text('summary'),  // Agent-generated summary of what it did
  actionCount: integer('action_count').default(0),
  
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});
```



### 4.2 Integration Credentials (Secure Storage)

```typescript
// Client system integrations
export const orgIntegrations = pgTable('org_integrations', {
  id: serial('id').primaryKey(),
  orgSlug: text('org_slug').notNull(),
  integrationType: text('integration_type').notNull(),  // 'quickbooks' | 'google' | 'stripe' | etc.
  
  // OAuth tokens (encrypted at rest)
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  tokenExpiresAt: timestamp('token_expires_at'),
  
  // Integration-specific config
  config: jsonb('config'),  // { companyId, realmId, etc. }
  
  // Health tracking
  status: text('status').default('active'),  // 'active' | 'expired' | 'error'
  lastSyncAt: timestamp('last_sync_at'),
  lastError: text('last_error'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

---

## 5. User Interfaces

### 5.1 Three Distinct Interfaces

| Interface | Users | Purpose ||-----------|-------|---------|| **Client Portal** | Nonprofit ED/staff | View agent work, approve high-risk actions, chat with Directors || **FDD Console** | DirectorforGood staff | Monitor all clients, intervene, train agents, handle escalations || **Admin Panel** | Platform admins | Manage tools, integrations, billing, system health |

### 5.2 Client Portal (Minimal, Output-Focused)

Clients don't need to learn software. They see:

- **Activity Feed**: What their Directors did today/this week
- **Pending Approvals**: Actions needing their sign-off
- **Reports**: Generated documents (financials, impact reports)
- **Chat**: Talk to a Director when needed
```javascript
┌─────────────────────────────────────────────────────────────┐
│  HiiiWAV Dashboard                            [Chat] [Help] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 Your Directors' Recent Work                             │
│  ─────────────────────────────────────────────────────────  │
│  ✓ Finance Director reconciled January transactions         │
│  ✓ Finance Director generated runway report (6.9 months)    │
│  ⏳ Development Director drafted donor thank-you emails (3)  │
│  ✓ Comms Director scheduled next week's social posts        │
│                                                             │
│  ⚠️ Needs Your Approval (2)                                  │
│  ─────────────────────────────────────────────────────────  │
│  [ ] Send email to Ford Foundation re: grant follow-up      │
│  [ ] Publish impact report to website                       │
│                                                             │
│  📄 Recent Reports                                          │
│  ─────────────────────────────────────────────────────────  │
│  • January 2025 Financial Summary                           │
│  • 2025 Impact Report (Draft)                               │
│  • Donor Pipeline Status                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```




### 5.3 FDD Console (Power Tools for Humans)

FDDs need to:

- See all client activity at a glance
- Drill into any agent's work
- Approve/reject/modify agent actions
- Take over and do work manually when needed
- Train agents by correcting their outputs
```javascript
┌─────────────────────────────────────────────────────────────┐
│  FDD Console - Pat's Dashboard                [All Clients] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🚨 Needs Attention                                          │
│  ─────────────────────────────────────────────────────────  │
│  • HiiiWAV: Finance Director flagged unusual $5k expense    │
│  • OTW: QuickBooks token expired, needs reconnect           │
│                                                             │
│  📋 Pending Reviews (7)                                      │
│  ─────────────────────────────────────────────────────────  │
│  [Review] HiiiWAV: Grant report draft ready                 │
│  [Review] OTW: Venue host outreach emails (12)              │
│  ...                                                        │
│                                                             │
│  📊 Client Health                                           │
│  ─────────────────────────────────────────────────────────  │
│  HiiiWAV    ████████░░ 80%   6.9mo runway  ✓ All synced    │
│  OTW        ██████████ 95%   N/A           ⚠️ QB expired    │
│  Client C   ██████░░░░ 60%   3.2mo runway  ✓ All synced    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```


---

## 6. Tool Implementation Examples

### 6.1 QuickBooks Tool (External)

```typescript
// lib/agents/tools/quickbooks.ts
export const quickbooksTools: Tool[] = [
  {
    id: 'quickbooks.getTransactions',
    name: 'Get QuickBooks Transactions',
    description: 'Retrieve transactions from QuickBooks for a date range',
    category: 'external',
    requiredIntegrations: ['quickbooks'],
    riskLevel: 'read-only',
    requiresApproval: false,
    
    inputSchema: z.object({
      startDate: z.string(),
      endDate: z.string(),
      accountTypes: z.array(z.string()).optional(),
    }),
    
    outputSchema: z.object({
      transactions: z.array(z.object({
        id: z.string(),
        date: z.string(),
        amount: z.number(),
        vendor: z.string().optional(),
        category: z.string().optional(),
      })),
    }),
    
    async execute(ctx, input) {
      const integration = await getIntegration(ctx.orgSlug, 'quickbooks');
      const qb = new QuickBooksClient(integration.accessToken);
      
      const transactions = await qb.query({
        startDate: input.startDate,
        endDate: input.endDate,
      });
      
      return {
        success: true,
        data: { transactions },
      };
    },
  },
  
  {
    id: 'quickbooks.createInvoice',
    name: 'Create QuickBooks Invoice',
    description: 'Create a new invoice in QuickBooks',
    category: 'external',
    requiredIntegrations: ['quickbooks'],
    riskLevel: 'medium',
    requiresApproval: true,  // Always needs human approval
    
    // ... schema and execute ...
  },
];
```



### 6.2 Internal Report Tool

```typescript
// lib/agents/tools/internal.ts
export const internalTools: Tool[] = [
  {
    id: 'internal.generateImpactReport',
    name: 'Generate Impact Report',
    description: 'Create an annual impact report from org data',
    category: 'internal',
    riskLevel: 'low',
    requiresApproval: false,  // Just creates draft
    
    inputSchema: z.object({
      year: z.number(),
      sections: z.array(z.string()).optional(),
    }),
    
    async execute(ctx, input) {
      const data = await gatherReportData(ctx.orgSlug, input.year);
      const report = await generateReport(data, input.sections);
      
      // Save to database
      const saved = await saveReportDraft(ctx.orgSlug, report);
      
      return {
        success: true,
        data: { reportId: saved.id, previewUrl: saved.url },
        sideEffects: [`Created draft impact report for ${input.year}`],
      };
    },
  },
];
```

---

## 7. Pricing Model: Services, Not Software

### 7.1 Service-Based Pricing

| Tier | Price | What Client Gets ||------|-------|------------------|| **Starter** | $0/mo | Impact report generator only (self-service) || **Foundation** | $299/mo | 3 AI Directors (Finance + Comms + ED Copilot), monthly check-ins || **Growth** | $999/mo | All 6 Directors, weekly briefs, FDD oversight || **Fractional ED** | $2,500/mo | Full Director OS + strategic FDD support || **Enterprise** | Custom | Dedicated agents, custom tools, embedded FDD |

### 7.2 Cost Structure

| Component | Cost Driver | How to Manage ||-----------|-------------|---------------|| AI compute | Token usage per action | Batch actions, cache common queries || FDD time | Human review hours | Increase automation as trust builds || Integrations | API calls to external services | Sync schedules, incremental updates || Infrastructure | Storage, compute | Shared Supabase, Vercel serverless |---

## 8. Implementation Roadmap

### Phase 1: Agent Foundation (Weeks 1-4)

- Build Tool interface and registry
- Implement agentActions audit logging
- Create first tools: internal DB operations, report generation
- Basic agent execution loop with approval workflow

### Phase 2: External Tools (Weeks 5-8)

- QuickBooks OAuth and tool implementation
- Google Calendar/Workspace tools (extend existing)
- Secure credential storage with encryption
- Integration health monitoring

### Phase 3: Human Interfaces (Weeks 9-12)

- Client Portal MVP (activity feed, approvals, chat)
- FDD Console (multi-client dashboard, intervention tools)
- Approval workflow UI
- Agent action review and correction

### Phase 4: Autonomy & Scale (Weeks 13-16)

- Progressive autonomy system
- Agent learning from corrections
- Performance analytics per agent
- Multi-org agent scheduling

---

## 9. Key Architectural Decisions

| Decision | Choice | Rationale ||----------|--------|-----------|| **Agent runtime** | Serverless (Vercel Functions + Cron) | Cost-effective, scales to zero when idle || **Tool execution** | Synchronous with timeout | Simpler than queues initially; add Inngest later if needed || **Credential storage** | Supabase with encryption | Already using Supabase; add Vault for enterprise || **Audit logging** | Every action in agentActions table | Critical for trust, debugging, and compliance || **Client interface** | Minimal portal, not full dashboard | Clients shouldn't need to "use software" |---

## 10. Directory Structure

```javascript
lib/
├── agents/
│   ├── types.ts              # Core agent type definitions
│   ├── runtime.ts            # Agent execution engine
│   ├── autonomy.ts           # Approval and autonomy rules
│   ├── tools/
│   │   ├── base.ts           # Tool interface and registry
│   │   ├── internal.ts       # Database, report, email tools
│   │   ├── quickbooks.ts     # QuickBooks connector
│   │   ├── google.ts         # Google Workspace tools
│   │   └── stripe.ts         # Stripe donation tools
│   └── directors/
│       ├── base.ts           # Base Director class
│       ├── finance.ts        # Finance Director
│       ├── development.ts    # Development Director
│       ├── operations.ts     # Ops Director
│       ├── communications.ts # Comms Director
│       ├── program.ts        # Program Director
│       └── executive.ts      # ED Copilot (coordinates other Directors)

app/
├── (client)/                  # Client-facing portal
│   └── [orgSlug]/
│       ├── portal/           # Activity, approvals, reports
│       └── chat/             # Chat with Directors
├── (fdd)/                    # FDD console
│   ├── dashboard/            # Multi-client overview
│   ├── clients/[orgSlug]/    # Per-client drill-down
│   └── reviews/              # Pending approvals queue
├── api/
│   ├── agents/               # Agent execution endpoints
│   │   ├── run/              # Trigger agent work
│   │   └── actions/          # Action CRUD
│   ├── tools/                # Tool execution
│   └── integrations/         # OAuth callbacks, webhooks
└── cron/                     # Scheduled agent jobs
```

---

## 11. Files to Create/Modify

### Immediate Priority

- `lib/agents/types.ts` - Core agent type definitions
- `lib/agents/runtime.ts` - Agent execution engine
- `lib/agents/tools/base.ts` - Tool interface and registry
- `db/schema.ts` - Add agentActions, tools, orgToolAccess tables

### Next Phase

- `lib/agents/tools/internal.ts` - Database, report, email tools
- `lib/agents/tools/quickbooks.ts` - QuickBooks connector
- `lib/agents/directors/finance.ts` - Finance Director agent
- `app/(client)/[orgSlug]/portal/` - Client portal routes
- `app/(fdd)/` - FDD console routes

---

## Summary

DirectorforGood is an **agent platform** where:

1. **Six AI Directors do real work** - Finance, Development, Ops, Comms, Program, and Executive (ED Copilot)
2. **Tools are the agent's hands** - both internal (our DB) and external (client's QuickBooks)
3. **The ED Copilot coordinates** - manages the other 5 Directors and helps the real ED
4. **Humans provide oversight** - FDDs initially, then clients approve high-risk actions
5. **Autonomy is earned** - agents start supervised and graduate to autonomous
6. **Every action is logged** - audit trail is essential for trust and debugging

The key insight: **We're selling fractional staff, not software subscriptions.** The agents are the product, and the software is just what they use to do their jobs.
