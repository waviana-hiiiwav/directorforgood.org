/**
 * FDD Tools Database Integration
 * 
 * This file provides typed access to the FDD tools database
 * and integrates with the Forward Deployed Director knowledge base.
 */

import toolsData from '@/data/fdd-tools.json';

// Types
export type ToolCategory = 
  | 'grants'
  | 'finance'
  | 'crm'
  | 'operations'
  | 'compliance'
  | 'communications'
  | 'legal'
  | 'hr'
  | 'ai'
  | 'fundraising';

export type SetupComplexity = 'low' | 'medium' | 'high';

export type PricingModel = 'free' | 'freemium' | 'subscription' | 'transaction';

export interface ToolPricing {
  model: PricingModel;
  notes: string;
}

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  url: string;
  description: string;
  whenToUse: string;
  pricing: ToolPricing;
  integrations: string[];
  setupComplexity: SetupComplexity;
  fddNotes: string;
  tags: string[];
}

export interface FDDToolsData {
  _meta: {
    version: string;
    lastUpdated: string;
    description: string;
  };
  categories: Record<ToolCategory, string>;
  tools: Tool[];
}

// Data access
const data = toolsData as FDDToolsData;

export function getAllTools(): Tool[] {
  return data.tools;
}

export function getToolById(id: string): Tool | undefined {
  return data.tools.find(tool => tool.id === id);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return data.tools.filter(tool => tool.category === category);
}

export function getToolsByTag(tag: string): Tool[] {
  return data.tools.filter(tool => tool.tags.includes(tag));
}

export function getEssentialTools(): Tool[] {
  return data.tools.filter(tool => tool.tags.includes('essential'));
}

export function getFreeTools(): Tool[] {
  return data.tools.filter(tool => 
    tool.pricing.model === 'free' || tool.pricing.model === 'freemium'
  );
}

export function getToolsByComplexity(complexity: SetupComplexity): Tool[] {
  return data.tools.filter(tool => tool.setupComplexity === complexity);
}

export function getCategoryDescription(category: ToolCategory): string {
  return data.categories[category];
}

export function getAllCategories(): ToolCategory[] {
  return Object.keys(data.categories) as ToolCategory[];
}

/**
 * Search tools by keyword across name, description, whenToUse, and tags
 */
export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return data.tools.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.whenToUse.toLowerCase().includes(lowerQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get tools recommended for common FDD tasks
 */
export function getToolsForTask(task: 
  | 'new-nonprofit-setup'
  | 'grant-application'
  | 'donor-management'
  | 'financial-management'
  | 'team-operations'
  | 'communications'
): Tool[] {
  const taskToolIds: Record<string, string[]> = {
    'new-nonprofit-setup': [
      'google-workspace',
      'techsoup',
      'candid',
      'quickbooks-online',
      'gusto',
      'canva',
      'slack',
    ],
    'grant-application': [
      'justfund',
      'submittable',
      'instrumentl',
      'candid',
      'claude',
      'skyvern',
    ],
    'donor-management': [
      'bloomerang',
      'little-green-light',
      'salesforce-npsp',
      'mailchimp',
    ],
    'financial-management': [
      'quickbooks-online',
      'xero',
      'billcom',
      'stripe',
      'gusto',
    ],
    'team-operations': [
      'google-workspace',
      'slack',
      'notion',
      'asana',
      'zoom',
    ],
    'communications': [
      'mailchimp',
      'canva',
      'buffer',
      'zoom',
    ],
  };

  const toolIds = taskToolIds[task] || [];
  return toolIds
    .map(id => getToolById(id))
    .filter((tool): tool is Tool => tool !== undefined);
}

/**
 * Format tools for FDD AI prompt context
 */
export function getToolsAsPromptText(): string {
  let text = `================================================================================
FDD TOOLS DATABASE
================================================================================

This is the comprehensive database of tools available to Forward Deployed Directors
when working with nonprofits, startups, and founders.

TOOL CATEGORIES:
`;

  // List categories
  for (const [category, description] of Object.entries(data.categories)) {
    text += `- ${category.toUpperCase()}: ${description}\n`;
  }

  text += `\n================================================================================
ESSENTIAL TOOLS (Set up these first for any new org)
================================================================================

`;

  const essentialTools = getEssentialTools();
  for (const tool of essentialTools) {
    text += formatToolForPrompt(tool);
  }

  text += `================================================================================
ALL TOOLS BY CATEGORY
================================================================================

`;

  // Group tools by category
  for (const category of getAllCategories()) {
    const categoryTools = getToolsByCategory(category);
    if (categoryTools.length === 0) continue;

    text += `\n--- ${category.toUpperCase()}: ${data.categories[category]} ---\n\n`;
    
    for (const tool of categoryTools) {
      if (!tool.tags.includes('essential')) {
        text += formatToolForPrompt(tool);
      }
    }
  }

  return text;
}

function formatToolForPrompt(tool: Tool): string {
  return `${tool.name} (${tool.url})
Category: ${tool.category}
Pricing: ${tool.pricing.model} - ${tool.pricing.notes}
Setup Complexity: ${tool.setupComplexity}
Description: ${tool.description}
When to Use: ${tool.whenToUse}
FDD Notes: ${tool.fddNotes}
Integrations: ${tool.integrations.length > 0 ? tool.integrations.join(', ') : 'None listed'}
Tags: ${tool.tags.join(', ')}

`;
}

/**
 * Get concise tool recommendations summary for quick reference
 */
export function getQuickReferenceText(): string {
  let text = `QUICK TOOL REFERENCE FOR FDD

NEW ORG SETUP CHECKLIST:
1. Google for Nonprofits → Free Workspace, Ad Grants
2. TechSoup → Validation + discounts
3. Candid/GuideStar → Claim profile to Gold level
4. QuickBooks Online → Accounting (TechSoup discount)
5. Gusto → Payroll when you have employees
6. Canva for Nonprofits → Free Pro design tools
7. Slack for Nonprofits → 85% off team chat

GRANT APPLICATIONS:
- JustFund → Create profile, common app system
- Submittable → Many foundations use this
- Instrumentl → Grant discovery ($179/mo but worth it)
- Claude → Draft assistance (always edit output)

DONOR CRM OPTIONS:
- Small (<$500K): Little Green Light ($45-150/mo)
- Medium ($500K-2M): Bloomerang ($99-499/mo)
- Large (>$2M): Salesforce NPSP (10 free licenses)

FUNDRAISING:
- Stripe → Best for custom/website (2.2% nonprofit rate)
- Givebutter → Events, crowdfunding, P2P (no platform fee)
- PayPal Giving Fund → Facebook/Venmo donations (free)
`;

  return text;
}

/**
 * FDD Tools prompt section for AI integration
 */
export const FDD_TOOLS_PROMPT = getToolsAsPromptText();

/**
 * Export the raw data for direct access if needed
 */
export const fddToolsData = data;



