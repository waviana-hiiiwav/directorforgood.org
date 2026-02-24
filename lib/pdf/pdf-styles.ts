import { StyleSheet } from '@react-pdf/renderer';
import type { PdfTheme } from '@/lib/brandkit/types';

// Default color palette - professional monochrome with accent
export const defaultColors = {
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  accent: '#3B82F6', // Blue accent for highlights
};

// Default typography
export const defaultFonts = {
  heading: 'Helvetica-Bold',
  body: 'Helvetica',
  light: 'Helvetica',
};

// Export defaults for backward compatibility
export const colors = defaultColors;
export const fonts = defaultFonts;

// Slide dimensions (16:9 aspect ratio)
export const slide = {
  width: 1920 / 2, // 960pt
  height: 1080 / 2, // 540pt
  padding: 40,
  paddingSmall: 24,
};

// Font sizes (reduced to fit slides)
export const fontSize = {
  title: 36,
  subtitle: 20,
  heading: 24,
  subheading: 18,
  body: 12,
  small: 10,
  tiny: 9,
};

// Spacing (tighter for slides)
export const spacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
};

/**
 * Create PDF styles from a brand theme
 * If no theme is provided, uses default colors/fonts
 */
export function createPdfStyles(theme?: PdfTheme) {
  const themeColors = theme?.colors || defaultColors;
  const themeFonts = theme?.fonts || defaultFonts;
  
  return StyleSheet.create({
    // Page/Slide styles
    page: {
      width: slide.width,
      height: slide.height,
      backgroundColor: themeColors.black || defaultColors.black,
      padding: slide.padding,
      position: 'relative',
    },
    pageLight: {
      width: slide.width,
      height: slide.height,
      backgroundColor: (themeColors as any).gray?.[900] || defaultColors.gray[900],
      padding: slide.padding,
      position: 'relative',
    },
    
    // Typography
    title: {
      fontFamily: themeFonts.heading || defaultFonts.heading,
      fontSize: fontSize.title,
      color: themeColors.white || defaultColors.white,
      marginBottom: spacing.lg,
    },
    subtitle: {
      fontFamily: themeFonts.body || defaultFonts.body,
      fontSize: fontSize.subtitle,
      color: (themeColors as any).gray?.[300] || defaultColors.gray[300],
      marginBottom: spacing.xl,
      lineHeight: 1.4,
    },
    heading: {
      fontFamily: themeFonts.heading || defaultFonts.heading,
      fontSize: fontSize.heading,
      color: themeColors.white || defaultColors.white,
      marginBottom: spacing.md,
    },
    subheading: {
      fontFamily: themeFonts.heading || defaultFonts.heading,
      fontSize: fontSize.subheading,
      color: themeColors.white || defaultColors.white,
      marginBottom: spacing.sm,
    },
    body: {
      fontFamily: themeFonts.body || defaultFonts.body,
      fontSize: fontSize.body,
      color: (themeColors as any).gray?.[300] || defaultColors.gray[300],
      lineHeight: 1.5,
    },
    bodyWhite: {
      fontFamily: themeFonts.body || defaultFonts.body,
      fontSize: fontSize.body,
      color: themeColors.white || defaultColors.white,
      lineHeight: 1.5,
    },
    small: {
      fontFamily: themeFonts.body || defaultFonts.body,
      fontSize: fontSize.small,
      color: (themeColors as any).gray?.[400] || defaultColors.gray[400],
      lineHeight: 1.4,
    },
  
  // Layout
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexGrow: {
    flexGrow: 1,
  },
  
    // Bullets
    bulletRow: {
      flexDirection: 'row',
      marginBottom: 3,
      alignItems: 'flex-start',
    },
    bulletDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: themeColors.white || defaultColors.white,
      marginRight: spacing.sm,
      marginTop: 4,
    },
    bulletText: {
      fontFamily: themeFonts.body || defaultFonts.body,
      fontSize: fontSize.body,
      color: (themeColors as any).gray?.[300] || defaultColors.gray[300],
      lineHeight: 1.4,
      flex: 1,
    },
    
    // Boxes/Cards
    card: {
      backgroundColor: (themeColors as any).gray?.[800] || defaultColors.gray[800],
      borderRadius: 8,
      padding: spacing.lg,
      marginBottom: spacing.md,
    },
    cardBordered: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: (themeColors as any).gray?.[700] || defaultColors.gray[700],
      borderRadius: 8,
      padding: spacing.lg,
      marginBottom: spacing.md,
    },
    cardHighlight: {
      backgroundColor: (themeColors as any).gray?.[800] || defaultColors.gray[800],
      borderWidth: 2,
      borderColor: themeColors.white || defaultColors.white,
      borderRadius: 8,
      padding: spacing.lg,
      marginBottom: spacing.md,
    },
    
    // Dividers
    divider: {
      height: 1,
      backgroundColor: (themeColors as any).gray?.[700] || defaultColors.gray[700],
      marginVertical: spacing.lg,
    },
    dividerVertical: {
      width: 4,
      backgroundColor: themeColors.white || defaultColors.white,
      marginRight: spacing.md,
    },
    
    // Footer/Page number
    footer: {
      position: 'absolute',
      bottom: spacing.lg,
      right: slide.padding,
      fontFamily: themeFonts.body || defaultFonts.body,
      fontSize: fontSize.tiny,
      color: (themeColors as any).gray?.[500] || defaultColors.gray[500],
    },
  
  // Two column layout
  twoColumn: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  columnHalf: {
    flex: 1,
  },
  
  // Grid layouts
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem2: {
    width: '48%',
  },
  
    // Placeholder styles
    imagePlaceholder: {
      backgroundColor: (themeColors as any).gray?.[800] || defaultColors.gray[800],
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: (themeColors as any).gray?.[700] || defaultColors.gray[700],
      borderStyle: 'dashed',
    },
    
    // Icon container
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: (themeColors as any).gray?.[800] || defaultColors.gray[800],
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
  });
}

// Default styles for backward compatibility
export const styles = createPdfStyles();

export default styles;

