import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

// Types
type ProposalItem = {
  id: number
  title: string
  description: string | null
  category: string
  requiresCollaboration: string | null
}

type ProposalData = {
  title: string
  client: string
  tier: string
  executiveSummary: string | null
  brandingIncluded: boolean
  teamReadinessNotes: string | null
  items: ProposalItem[]
  createdAt: Date | string
}

// Colors
const colors = {
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
  },
  accent: '#99FF69',
  accentDark: '#4CAF50',
};

// Styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    padding: 50,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBox: {
    width: 32,
    height: 32,
    backgroundColor: colors.accent,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[500],
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  summaryBox: {
    backgroundColor: colors.gray[100],
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  deliverableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  deliverableItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 10,
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
    marginRight: 8,
    marginTop: 2,
  },
  deliverableText: {
    fontSize: 10,
    color: colors.gray[600],
    flex: 1,
  },
  pricingBox: {
    backgroundColor: colors.black,
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 10,
    color: colors.gray[400],
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
  },
  priceDescription: {
    fontSize: 10,
    color: colors.gray[400],
    marginTop: 4,
  },
  brandingNote: {
    backgroundColor: '#E8FFD9',
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.accentDark,
  },
  brandingText: {
    fontSize: 10,
    color: colors.gray[600],
  },
  bodyText: {
    fontSize: 11,
    color: colors.gray[600],
    lineHeight: 1.6,
  },
  scopeItem: {
    backgroundColor: colors.gray[100],
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  scopeTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    marginBottom: 4,
  },
  scopeDescription: {
    fontSize: 10,
    color: colors.gray[500],
  },
  collaborationNote: {
    fontSize: 9,
    color: colors.accentDark,
    marginTop: 4,
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  warningTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#92400E',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 10,
    color: '#92400E',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: colors.gray[400],
  },
  categoryTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray[500],
    marginBottom: 10,
    marginTop: 16,
  },
});

interface ProposalPDFProps {
  proposal: ProposalData
}

export function ProposalPDF({ proposal }: ProposalPDFProps) {
  const includedItems = proposal.items.filter((item) => 
    'included' in item ? (item as ProposalItem & { included: boolean }).included : true
  );
  const coreItems = includedItems.filter((item) => item.category === 'core');
  const optionalItems = includedItems.filter((item) => item.category === 'optional');
  const addOnItems = includedItems.filter((item) => item.category === 'add_on');

  const tierLabel = proposal.tier === 'primary' ? '$25,000' : '$20,000';
  const tierDescription = proposal.tier === 'primary'
    ? 'Four-workshop sprint with full scope'
    : 'Three-workshop sprint, compressed timeline';

  const createdDate = new Date(proposal.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>H</Text>
            </View>
            <Text style={styles.companyName}>HiiiWAV</Text>
          </View>
          <Text style={styles.title}>{proposal.title}</Text>
          <Text style={styles.subtitle}>Prepared for {proposal.client}</Text>
        </View>

        {/* Key Deliverables Summary */}
        <View style={styles.summaryBox}>
          <Text style={{ ...styles.sectionTitle, borderBottomWidth: 0, marginBottom: 10 }}>
            Key Deliverables
          </Text>
          <View style={styles.deliverableGrid}>
            {includedItems.slice(0, 10).map((item) => (
              <View key={item.id} style={styles.deliverableItem}>
                <View style={styles.checkmark} />
                <Text style={styles.deliverableText}>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingBox}>
          <Text style={styles.priceLabel}>Investment</Text>
          <Text style={styles.priceValue}>{tierLabel}</Text>
          <Text style={styles.priceDescription}>{tierDescription}</Text>
          
          {proposal.brandingIncluded && (
            <View style={styles.brandingNote}>
              <Text style={styles.brandingText}>
                Includes HiiiWAV branding — Partner will receive additional exposure through HiiiWAV's network and promotional channels.
              </Text>
            </View>
          )}
        </View>

        {/* Executive Summary */}
        {proposal.executiveSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Executive Summary</Text>
            <Text style={styles.bodyText}>{proposal.executiveSummary}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>HiiiWAV</Text>
          <Text style={styles.footerText}>Prepared {createdDate}</Text>
        </View>
      </Page>

      {/* Scope of Work Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Scope of Work</Text>

        {coreItems.length > 0 && (
          <>
            <Text style={styles.categoryTitle}>Core Services (Included)</Text>
            {coreItems.map((item) => (
              <View key={item.id} style={styles.scopeItem}>
                <Text style={styles.scopeTitle}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.scopeDescription}>{item.description}</Text>
                )}
                {item.requiresCollaboration && (
                  <Text style={styles.collaborationNote}>
                    Requires collaboration with {item.requiresCollaboration}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}

        {optionalItems.length > 0 && (
          <>
            <Text style={styles.categoryTitle}>Optional Services (Included)</Text>
            {optionalItems.map((item) => (
              <View key={item.id} style={styles.scopeItem}>
                <Text style={styles.scopeTitle}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.scopeDescription}>{item.description}</Text>
                )}
                {item.requiresCollaboration && (
                  <Text style={styles.collaborationNote}>
                    Requires collaboration with {item.requiresCollaboration}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}

        {addOnItems.length > 0 && (
          <>
            <Text style={styles.categoryTitle}>Add-ons (Included)</Text>
            {addOnItems.map((item) => (
              <View key={item.id} style={styles.scopeItem}>
                <Text style={styles.scopeTitle}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.scopeDescription}>{item.description}</Text>
                )}
              </View>
            ))}
          </>
        )}

        {/* Team Readiness */}
        {proposal.teamReadinessNotes && (
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>Team Readiness Requirements</Text>
            <Text style={styles.warningText}>{proposal.teamReadinessNotes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>HiiiWAV</Text>
          <Text style={styles.footerText}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}

export default ProposalPDF;



