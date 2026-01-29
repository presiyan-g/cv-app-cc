# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev` (Vite, port 5173)
- **Build**: `npm run build` (runs `tsc -b && vite build`)
- **Lint**: `npm run lint` (ESLint)
- **Preview prod build**: `npm run preview`

No test framework is configured.

## Architecture

This is a CV/resume creator built with React 19 + TypeScript + Vite + Tailwind CSS.

### Routing

Five routes: `/` (landing), `/templates` (template gallery), `/dashboard` (CV list management), `/editor/:id` (editing), `/export/:id` (PDF export). Defined in `src/app/Router.tsx`.

### State Management

Two Zustand stores with Immer middleware:

- **cvStore** (`src/stores/cvStore.ts`) — current CV being edited. Handles section/entry CRUD, autosave with 3s debounce, and revision history (last 10).
- **dashboardStore** (`src/stores/dashboardStore.ts`) — CV list metadata. Create/duplicate/delete/rename operations.

Both persist through **StorageService** (`src/services/storage/StorageService.ts`), a localStorage abstraction using `cv_` prefix for CV data, `cv_list` for metadata, and `revision_` prefix for revisions.

### Core Data Model

Defined in `src/features/cv/types.ts`. A `CV` contains `personalInfo`, `sections` (8 types: summary, experience, education, skills, projects, certifications, languages, awards), `layout`, `theme`, and `header` settings.

### Editor Structure

Three-panel layout in `src/pages/Editor/`:
- **Sidebar** (left): draggable section list + section edit panels (`Panels/` has per-section-type forms)
- **Canvas** (center): live A4 preview with responsive scaling (`Canvas.tsx`, ~600 lines)
- **Controls** (right): theme, layout, typography settings

### PDF Export

`src/features/export/CVDocument.tsx` (~620 lines) uses `@react-pdf/renderer` to generate PDFs. This is a separate rendering pipeline from the Canvas preview — changes to CV rendering must be updated in both.

### Key Libraries

- **TipTap** for rich text editing
- **@dnd-kit** for drag-and-drop section reordering
- **react-image-crop** for photo upload/cropping
- **clsx + tailwind-merge** via `src/lib/utils.ts` `cn()` helper

### Code Organization

Feature-based: `src/features/` for domain logic (cv types, templates, export), `src/pages/` for route components, `src/stores/` for state, `src/components/ui/` for reusable UI primitives.
