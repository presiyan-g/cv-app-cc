import { create } from 'zustand';
import type { CVMetadata, CV } from '../features/cv/types';
import { storageService } from '../services/storage/StorageService';
import { useCVStore } from './cvStore';

interface DashboardState {
  cvList: CVMetadata[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCVList: () => Promise<void>;
  createCV: (name: string, templateId: string) => Promise<CV>;
  duplicateCV: (id: string) => Promise<CV | null>;
  deleteCV: (id: string) => Promise<void>;
  renameCV: (id: string, name: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  cvList: [],
  isLoading: false,
  error: null,

  loadCVList: async () => {
    set({ isLoading: true, error: null });
    try {
      const cvList = await storageService.getAllCVMetadata();
      // Sort by updatedAt descending
      cvList.sort((a, b) => b.updatedAt - a.updatedAt);
      set({ cvList, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load CVs', isLoading: false });
    }
  },

  createCV: async (name: string, templateId: string) => {
    const cv = await useCVStore.getState().createCV(name, templateId);
    await get().loadCVList();
    return cv;
  },

  duplicateCV: async (id: string) => {
    const originalCV = await storageService.getCV(id);
    if (!originalCV) return null;

    const { createCV } = useCVStore.getState();
    const duplicatedCV = await createCV(
      `${originalCV.name} (Copy)`,
      originalCV.templateId
    );

    // Copy over the content
    const cvStore = useCVStore.getState();
    cvStore.updatePersonalInfo(originalCV.personalInfo);

    // Copy sections with their entries
    for (const section of originalCV.sections) {
      const newSection = duplicatedCV.sections.find(s => s.type === section.type);
      if (newSection) {
        cvStore.updateSection(newSection.id, {
          enabled: section.enabled,
          column: section.column,
          title: section.title,
        });

        for (const entry of section.entries) {
          cvStore.addEntry(newSection.id, {
            ...entry,
            id: crypto.randomUUID(),
          });
        }
      }
    }

    cvStore.updateLayout(originalCV.layout);
    cvStore.updateTheme(originalCV.theme);
    await cvStore.save();

    await get().loadCVList();
    return useCVStore.getState().cv;
  },

  deleteCV: async (id: string) => {
    await storageService.deleteCV(id);
    await get().loadCVList();
  },

  renameCV: async (id: string, name: string) => {
    const cv = await storageService.getCV(id);
    if (!cv) return;

    cv.name = name;
    cv.updatedAt = Date.now();
    await storageService.saveCV(cv);
    await get().loadCVList();
  },
}));
