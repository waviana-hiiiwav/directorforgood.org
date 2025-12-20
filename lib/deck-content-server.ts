// Server-only functions for deck content file operations
// These use Node.js fs module and can only be used in server components/API routes

import fs from 'fs';
import path from 'path';
import { DeckContent, defaultDeckContent } from './deck-content';
import { syncPitchDeckFile } from '../scripts/sync-pitch-deck';

// Path to the JSON files that store deck content
function getContentFilePath(slug: string = 'director') {
  return path.join(process.cwd(), 'data', `${slug}-deck-content.json`);
}

// Ensure the data directory exists
function ensureDataDir(filePath: string) {
  const dataDir = path.dirname(filePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load content from file, or return defaults if file doesn't exist
export function getDeckContent(slug: string = 'director'): DeckContent {
  const filePath = getContentFilePath(slug);
  try {
    ensureDataDir(filePath);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent) as DeckContent;
    }
  } catch (error) {
    console.error(`Error reading ${slug} deck content file:`, error);
  }
  
  // Return default content if no file exists
  // For non-director decks, we might want to return an empty scaffold instead of director defaults
  if (slug !== 'director') {
    return {
      ...defaultDeckContent,
      cover: {
        ...defaultDeckContent.cover,
        title: slug.toUpperCase(),
      },
      slides: [],
      slideOrder: [],
    };
  }
  
  return { ...defaultDeckContent };
}

// Save content to file
export function updateDeckContent(content: Partial<DeckContent>, slug: string = 'director'): DeckContent {
  const filePath = getContentFilePath(slug);
  try {
    ensureDataDir(filePath);
    const currentContent = getDeckContent(slug);
    const updatedContent = { ...currentContent, ...content };
    fs.writeFileSync(filePath, JSON.stringify(updatedContent, null, 2), 'utf-8');
    
    // Auto-sync PITCH_DECK.txt only for director deck
    if (slug === 'director') {
      syncPitchDeckFile(updatedContent);
    }
    
    return updatedContent;
  } catch (error) {
    console.error(`Error writing ${slug} deck content file:`, error);
    throw error;
  }
}

// Reset content to defaults
export function resetDeckContent(slug: string = 'director'): DeckContent {
  const filePath = getContentFilePath(slug);
  const content = slug === 'director' ? defaultDeckContent : { ...defaultDeckContent, slides: [], slideOrder: [] };
  try {
    ensureDataDir(filePath);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error resetting ${slug} deck content file:`, error);
    throw error;
  }
}






