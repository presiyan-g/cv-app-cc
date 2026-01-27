import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  CV,
  PersonalInfo,
  Section,
  SectionEntry,
  LayoutSettings,
  ThemeSettings,
  Revision
} from '../features/cv/types';
import {
  DEFAULT_PERSONAL_INFO,
  DEFAULT_LAYOUT,
  DEFAULT_THEME,
  DEFAULT_SECTIONS
} from '../features/cv/types';
import { storageService } from '../services/storage/StorageService';
import { generateId } from '../lib/utils';

interface CVState {
  cv: CV | null;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: number | null;

  // Actions
  loadCV: (id: string) => Promise<void>;
  createCV: (name: string, templateId: string) => Promise<CV>;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  reorderSections: (sectionIds: string[]) => void;
  addEntry: (sectionId: string, entry: SectionEntry) => void;
  updateEntry: (sectionId: string, entryId: string, updates: Partial<SectionEntry>) => void;
  removeEntry: (sectionId: string, entryId: string) => void;
  reorderEntries: (sectionId: string, entryIds: string[]) => void;
  updateLayout: (layout: Partial<LayoutSettings>) => void;
  updateTheme: (theme: Partial<ThemeSettings>) => void;
  updateName: (name: string) => void;
  save: () => Promise<void>;
  saveRevision: () => Promise<void>;
  reset: () => void;
}

export const useCVStore = create<CVState>()(
  immer((set, get) => ({
    cv: null,
    isDirty: false,
    isSaving: false,
    lastSaved: null,

    loadCV: async (id: string) => {
      const cv = await storageService.getCV(id);
      // Migrate older CVs to include new properties
      if (cv) {
        if (!cv.theme.separatorColor) {
          cv.theme.separatorColor = DEFAULT_THEME.separatorColor;
        }
        if (!cv.personalInfo.photoPosition) {
          cv.personalInfo.photoPosition = DEFAULT_PERSONAL_INFO.photoPosition;
        }
      }
      set(state => {
        state.cv = cv;
        state.isDirty = false;
        state.lastSaved = cv?.updatedAt || null;
      });
    },

    createCV: async (name: string, templateId: string) => {
      const now = Date.now();
      const cv: CV = {
        id: generateId(),
        name,
        templateId,
        createdAt: now,
        updatedAt: now,
        personalInfo: { ...DEFAULT_PERSONAL_INFO },
        sections: DEFAULT_SECTIONS.map(section => ({
          ...section,
          id: generateId(),
          entries: [],
        })),
        layout: { ...DEFAULT_LAYOUT },
        theme: { ...DEFAULT_THEME },
      };

      await storageService.saveCV(cv);
      set(state => {
        state.cv = cv;
        state.isDirty = false;
        state.lastSaved = now;
      });

      return cv;
    },

    updatePersonalInfo: (info: Partial<PersonalInfo>) => {
      set(state => {
        if (state.cv) {
          state.cv.personalInfo = { ...state.cv.personalInfo, ...info };
          state.cv.updatedAt = Date.now();
          state.isDirty = true;
        }
      });
    },

    updateSection: (sectionId: string, updates: Partial<Section>) => {
      set(state => {
        if (state.cv) {
          const section = state.cv.sections.find(s => s.id === sectionId);
          if (section) {
            Object.assign(section, updates);
            state.cv.updatedAt = Date.now();
            state.isDirty = true;
          }
        }
      });
    },

    reorderSections: (sectionIds: string[]) => {
      set(state => {
        if (state.cv) {
          const sectionMap = new Map(state.cv.sections.map(s => [s.id, s]));
          state.cv.sections = sectionIds
            .map((id, index) => {
              const section = sectionMap.get(id);
              if (section) {
                section.order = index;
                return section;
              }
              return null;
            })
            .filter((s): s is Section => s !== null);
          state.cv.updatedAt = Date.now();
          state.isDirty = true;
        }
      });
    },

    addEntry: (sectionId: string, entry: SectionEntry) => {
      set(state => {
        if (state.cv) {
          const section = state.cv.sections.find(s => s.id === sectionId);
          if (section) {
            section.entries.push(entry);
            state.cv.updatedAt = Date.now();
            state.isDirty = true;
          }
        }
      });
    },

    updateEntry: (sectionId: string, entryId: string, updates: Partial<SectionEntry>) => {
      set(state => {
        if (state.cv) {
          const section = state.cv.sections.find(s => s.id === sectionId);
          if (section) {
            const entry = section.entries.find(e => e.id === entryId);
            if (entry) {
              Object.assign(entry, updates);
              state.cv.updatedAt = Date.now();
              state.isDirty = true;
            }
          }
        }
      });
    },

    removeEntry: (sectionId: string, entryId: string) => {
      set(state => {
        if (state.cv) {
          const section = state.cv.sections.find(s => s.id === sectionId);
          if (section) {
            section.entries = section.entries.filter(e => e.id !== entryId);
            state.cv.updatedAt = Date.now();
            state.isDirty = true;
          }
        }
      });
    },

    reorderEntries: (sectionId: string, entryIds: string[]) => {
      set(state => {
        if (state.cv) {
          const section = state.cv.sections.find(s => s.id === sectionId);
          if (section) {
            const entryMap = new Map(section.entries.map(e => [e.id, e]));
            section.entries = entryIds
              .map(id => entryMap.get(id))
              .filter((e): e is SectionEntry => e !== undefined);
            state.cv.updatedAt = Date.now();
            state.isDirty = true;
          }
        }
      });
    },

    updateLayout: (layout: Partial<LayoutSettings>) => {
      set(state => {
        if (state.cv) {
          state.cv.layout = { ...state.cv.layout, ...layout };
          state.cv.updatedAt = Date.now();
          state.isDirty = true;
        }
      });
    },

    updateTheme: (theme: Partial<ThemeSettings>) => {
      set(state => {
        if (state.cv) {
          state.cv.theme = { ...state.cv.theme, ...theme };
          state.cv.updatedAt = Date.now();
          state.isDirty = true;
        }
      });
    },

    updateName: (name: string) => {
      set(state => {
        if (state.cv) {
          state.cv.name = name;
          state.cv.updatedAt = Date.now();
          state.isDirty = true;
        }
      });
    },

    save: async () => {
      const { cv, isDirty } = get();
      if (!cv || !isDirty) return;

      set(state => {
        state.isSaving = true;
      });

      try {
        await storageService.saveCV(cv);
        set(state => {
          state.isDirty = false;
          state.isSaving = false;
          state.lastSaved = cv.updatedAt;
        });
      } catch (error) {
        set(state => {
          state.isSaving = false;
        });
        throw error;
      }
    },

    saveRevision: async () => {
      const { cv } = get();
      if (!cv) return;

      const revision: Revision = {
        id: generateId(),
        cvId: cv.id,
        timestamp: Date.now(),
        data: JSON.parse(JSON.stringify(cv)), // Deep clone
      };

      await storageService.saveRevision(revision);
    },

    reset: () => {
      set(state => {
        state.cv = null;
        state.isDirty = false;
        state.isSaving = false;
        state.lastSaved = null;
      });
    },
  }))
);
