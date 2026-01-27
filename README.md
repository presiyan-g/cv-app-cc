# CV Creator

A modern CV/Resume creator application built with React, TypeScript, and Tailwind CSS. Create professional resumes with live preview, drag-and-drop section reordering, and PDF export.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with immer middleware)
- **Drag & Drop**: @dnd-kit
- **Rich Text**: TipTap
- **PDF Export**: @react-pdf/renderer
- **Image Cropping**: react-image-crop
- **Routing**: React Router DOM

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
cv-app-cc/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Root component
│   │   └── Router.tsx           # Route definitions
│   │
│   ├── pages/
│   │   ├── Landing/             # Hero + CTA landing page
│   │   ├── Templates/           # Template gallery (6 templates)
│   │   ├── Dashboard/           # CV management (CRUD)
│   │   ├── Editor/              # Main editing experience
│   │   │   └── components/
│   │   │       ├── Sidebar/     # Section list + panels
│   │   │       ├── Canvas/      # Live preview
│   │   │       ├── Panels/      # Section-specific forms
│   │   │       ├── Controls/    # Theme & layout controls
│   │   │       ├── RichTextEditor/
│   │   │       └── PhotoUpload/
│   │   └── Export/              # PDF export page
│   │
│   ├── features/
│   │   ├── cv/
│   │   │   └── types.ts         # Core data models & defaults
│   │   ├── templates/
│   │   │   └── templates.ts     # Template definitions
│   │   └── export/
│   │       └── CVDocument.tsx   # PDF generation component
│   │
│   ├── stores/
│   │   ├── cvStore.ts           # Current CV state (Zustand + immer)
│   │   └── dashboardStore.ts    # All CVs management
│   │
│   ├── services/
│   │   └── storage/
│   │       └── StorageService.ts # LocalStorage adapter
│   │
│   ├── components/
│   │   ├── ui/                  # Button, Input, Modal, Card, etc.
│   │   ├── layout/              # Header, Footer
│   │   └── common/              # LoadingSpinner, EmptyState
│   │
│   ├── hooks/                   # useDebounce, useLocalStorage
│   ├── lib/
│   │   └── utils.ts             # cn(), generateId(), formatDate(), etc.
│   └── styles/
│       └── index.css            # Tailwind + custom classes
```

## Features Implemented

### Landing Page
- Hero section with CTA
- Features overview (Templates, Easy Editing, PDF Export)
- Privacy section (local storage emphasis)

### Templates Page
- 6 pre-built templates: Classic, Modern, Minimal, Executive, Creative, Tech
- Category filtering (All, Professional, Modern, Creative)
- Template preview cards with hover effects
- Modal for naming new CV

### Dashboard
- Grid view of all CVs
- Create, rename, duplicate, delete CVs
- Last updated timestamps
- Empty state with CTA

### Editor (3-Panel Layout)

#### Left Panel - Sidebar
- Personal Info section (always first)
- Draggable section list with enable/disable toggles
- Section-specific edit panels:
  - **Personal Info**: Name, title, contact, photo upload
  - **Summary**: Rich text editor
  - **Experience**: Company, position, dates, rich text description
  - **Education**: Institution, degree, field, dates
  - **Skills**: Category-based with tag input
  - **Projects**: Name, URL, dates, rich text description
  - **Certifications**: Name, issuer, date, URL
  - **Languages**: Language + proficiency level
  - **Awards**: Title, issuer, date, description

#### Center Panel - Canvas
- Live A4-sized preview
- Responsive to theme changes
- Shows all enabled sections
- Photo display with shape/size options

#### Right Panel - Controls
- **Layout**: Single/Two column toggle, column split ratio slider
- **Colors**: Preset color palette + custom color picker
- **Typography**: Font family, size, line height, heading style

### Autosave System
- Debounced save (3 seconds after last change)
- Save on window blur
- Visual indicator: "Saving..." / "Saved at [time]"
- Revision history stored (last 10 revisions)

### PDF Export
- Native PDF generation with @react-pdf/renderer
- Helvetica font (built-in, no external loading)
- Matches live preview styling
- Download button with loading state

## Data Models

### CV Structure
```typescript
interface CV {
  id: string;
  name: string;
  templateId: string;
  createdAt: number;
  updatedAt: number;
  personalInfo: PersonalInfo;
  sections: Section[];
  layout: LayoutSettings;
  theme: ThemeSettings;
}
```

### Section Types
- summary, experience, education, skills, projects, certifications, languages, awards

### Storage
- CVs stored in LocalStorage with `cv_` prefix
- CV list metadata stored separately for quick loading
- Revisions stored with `revision_` prefix (max 10 per CV)

## Known Issues / Limitations

1. **Bundle Size**: Large bundle (~2.3MB) due to PDF renderer. Could benefit from code-splitting.
2. **PDF Fonts**: Currently uses built-in Helvetica. Custom fonts would require bundling TTF files.
3. **Two-Column Layout**: Section assignment to columns not fully implemented in UI.
4. **Mobile**: Editor is functional but optimized for desktop.

## What's Left to Implement (from original plan)

### Phase 7: Polish
- [ ] Responsive design refinements
- [ ] Keyboard shortcuts
- [ ] Error boundaries
- [ ] Accessibility improvements (ARIA labels, focus management)

### Additional Enhancements
- [ ] Template-specific styling in PDF
- [ ] Import/export CV as JSON
- [ ] Multiple CV comparison view
- [ ] Undo/redo functionality
- [ ] Print-optimized CSS
- [ ] IndexedDB for photo storage (currently base64 in localStorage)

## File Quick Reference

| File | Purpose |
|------|---------|
| `src/features/cv/types.ts` | All TypeScript interfaces and defaults |
| `src/stores/cvStore.ts` | CV editing state and actions |
| `src/stores/dashboardStore.ts` | CV list management |
| `src/services/storage/StorageService.ts` | LocalStorage abstraction |
| `src/features/export/CVDocument.tsx` | PDF generation component |
| `src/pages/Editor/EditorPage.tsx` | Main editor page with autosave |
| `src/pages/Editor/components/Canvas/Canvas.tsx` | Live preview renderer |

## Scripts

```bash
npm run dev      # Start dev server (usually http://localhost:5173)
npm run build    # TypeScript check + production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

## Development Notes

### Adding a New Section Type
1. Add type to `SectionType` union in `src/features/cv/types.ts`
2. Create entry interface (e.g., `NewSectionEntry`)
3. Add to `DEFAULT_SECTIONS` array
4. Create panel component in `src/pages/Editor/components/Panels/`
5. Add panel to `Sidebar.tsx` switch statement
6. Add renderer to `Canvas.tsx`
7. Add PDF renderer to `CVDocument.tsx`

### Storage Service
The `IStorageService` interface allows swapping LocalStorage for an API backend:
```typescript
interface IStorageService {
  getCV(id: string): Promise<CV | null>;
  saveCV(cv: CV): Promise<void>;
  deleteCV(id: string): Promise<void>;
  getAllCVMetadata(): Promise<CVMetadata[]>;
  getRevisions(cvId: string): Promise<Revision[]>;
  saveRevision(revision: Revision): Promise<void>;
}
```
