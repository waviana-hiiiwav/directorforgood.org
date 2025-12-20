# Appendix Documentation Guide

## How to Add Documents to the Appendix

The appendix slide is located at the end of the deck (slide 15) and displays supporting documents.

### Current Documents

1. **Mayor's Office Announcement** (November 25, 2025)
   - Type: Announcement
   - Source: Mayor's Office - Mayor Barbara Lee

### Adding New Documents

To add a new document to the appendix, edit `/src/data/slides.ts` and add a new entry to the `documents` array in the `appendix` slide:

```typescript
{
  id: 'unique-document-id',
  title: 'Document Title Here',
  date: 'Date of document (optional)',
  source: 'Source/Author (optional)',
  type: 'announcement' | 'report' | 'proposal' | 'other',
  content: `Full document content here. Can be multiple paragraphs.
  
You can include:
- Bullet points
- Quotes
- Key highlights
- Full text content`,
}
```

### Document Types

- `announcement` - Press releases, announcements
- `report` - Impact reports, research reports
- `proposal` - Funding proposals, project proposals
- `other` - Any other type of document

### Example: Adding a Report

```typescript
{
  id: 'impact-report-2024',
  title: '2024 HiiiWAV Impact Report',
  date: '2024',
  source: 'HiiiWAV',
  type: 'report',
  content: `Full report content here...`,
}
```

### Tips

- Keep content concise but informative
- Use clear, descriptive titles
- Include dates when available
- Format content with line breaks for readability
- All text is editable in the app - you can refine it there too!








