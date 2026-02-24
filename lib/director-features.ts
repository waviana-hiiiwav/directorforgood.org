/**
 * Director Features Data Access
 * 
 * Provides typed access to director features and active development tracking
 */

import featuresData from '@/data/director-features.json';
import developmentData from '@/data/active-development.json';

// Types
export type DirectorRole = 
  | 'executive'
  | 'finance'
  | 'development'
  | 'ops'
  | 'communications'
  | 'program';

export type DevelopmentStatus = 'in-development' | 'active' | 'planned';

export interface Feature {
  id: string;
  title: string;
  description: string;
  directorRole: DirectorRole;
}

export interface ActiveDevelopment {
  id: string;
  name: string;
  status: DevelopmentStatus;
  directorRole: DirectorRole;
  relatedFeatures: string[];
  notes: string;
  lastUpdated: string;
  techStack?: string[];
}

interface FeaturesData {
  _meta: {
    version: string;
    lastUpdated: string;
    description: string;
  };
  features: Feature[];
}

interface DevelopmentData {
  _meta: {
    version: string;
    lastUpdated: string;
    description: string;
  };
  activeDevelopment: ActiveDevelopment[];
}

// Data access
const features = featuresData as FeaturesData;
const development = developmentData as DevelopmentData;

/**
 * Get all features
 */
export function getAllFeatures(): Feature[] {
  return features.features;
}

/**
 * Get features by director role
 */
export function getFeaturesByRole(role: DirectorRole): Feature[] {
  return features.features.filter(feature => feature.directorRole === role);
}

/**
 * Get feature by ID
 */
export function getFeatureById(id: string): Feature | undefined {
  return features.features.find(feature => feature.id === id);
}

/**
 * Get all director roles
 */
export function getAllDirectorRoles(): DirectorRole[] {
  return ['executive', 'finance', 'development', 'ops', 'communications', 'program'];
}

/**
 * Get display name for director role
 */
export function getDirectorRoleDisplayName(role: DirectorRole): string {
  const names: Record<DirectorRole, string> = {
    executive: 'Executive Director',
    finance: 'Finance Director',
    development: 'Development Director',
    ops: 'Ops Director',
    communications: 'Communications Director',
    program: 'Program Director',
  };
  return names[role];
}

/**
 * Get all active development items
 */
export function getAllActiveDevelopment(): ActiveDevelopment[] {
  return development.activeDevelopment;
}

/**
 * Get active development by status
 */
export function getActiveDevelopmentByStatus(status: DevelopmentStatus): ActiveDevelopment[] {
  return development.activeDevelopment.filter(item => item.status === status);
}

/**
 * Get active development by director role
 */
export function getActiveDevelopmentByRole(role: DirectorRole): ActiveDevelopment[] {
  return development.activeDevelopment.filter(item => item.directorRole === role);
}

/**
 * Get active development item by ID
 */
export function getActiveDevelopmentById(id: string): ActiveDevelopment | undefined {
  return development.activeDevelopment.find(item => item.id === id);
}

/**
 * Get features related to an active development item
 */
export function getRelatedFeatures(developmentItem: ActiveDevelopment): Feature[] {
  return developmentItem.relatedFeatures
    .map(featureId => getFeatureById(featureId))
    .filter((feature): feature is Feature => feature !== undefined);
}



