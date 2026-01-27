import type { CV, CVMetadata, Revision } from '../../features/cv/types';

export interface IStorageService {
  getCV(id: string): Promise<CV | null>;
  saveCV(cv: CV): Promise<void>;
  deleteCV(id: string): Promise<void>;
  getAllCVMetadata(): Promise<CVMetadata[]>;
  getRevisions(cvId: string): Promise<Revision[]>;
  saveRevision(revision: Revision): Promise<void>;
  clearRevisions(cvId: string): Promise<void>;
}

const CV_PREFIX = 'cv_';
const CV_LIST_KEY = 'cv_list';
const REVISION_PREFIX = 'revision_';
const MAX_REVISIONS = 10;

export class LocalStorageAdapter implements IStorageService {
  async getCV(id: string): Promise<CV | null> {
    const data = localStorage.getItem(CV_PREFIX + id);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async saveCV(cv: CV): Promise<void> {
    localStorage.setItem(CV_PREFIX + cv.id, JSON.stringify(cv));
    await this.updateCVList(cv);
  }

  async deleteCV(id: string): Promise<void> {
    localStorage.removeItem(CV_PREFIX + id);
    await this.removeCVFromList(id);
    await this.clearRevisions(id);
  }

  async getAllCVMetadata(): Promise<CVMetadata[]> {
    const listData = localStorage.getItem(CV_LIST_KEY);
    if (!listData) return [];
    try {
      return JSON.parse(listData);
    } catch {
      return [];
    }
  }

  async getRevisions(cvId: string): Promise<Revision[]> {
    const data = localStorage.getItem(REVISION_PREFIX + cvId);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async saveRevision(revision: Revision): Promise<void> {
    const revisions = await this.getRevisions(revision.cvId);
    revisions.unshift(revision);

    // Keep only the last MAX_REVISIONS
    const trimmedRevisions = revisions.slice(0, MAX_REVISIONS);
    localStorage.setItem(REVISION_PREFIX + revision.cvId, JSON.stringify(trimmedRevisions));
  }

  async clearRevisions(cvId: string): Promise<void> {
    localStorage.removeItem(REVISION_PREFIX + cvId);
  }

  private async updateCVList(cv: CV): Promise<void> {
    const list = await this.getAllCVMetadata();
    const metadata: CVMetadata = {
      id: cv.id,
      name: cv.name,
      templateId: cv.templateId,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
    };

    const existingIndex = list.findIndex(item => item.id === cv.id);
    if (existingIndex >= 0) {
      list[existingIndex] = metadata;
    } else {
      list.unshift(metadata);
    }

    localStorage.setItem(CV_LIST_KEY, JSON.stringify(list));
  }

  private async removeCVFromList(id: string): Promise<void> {
    const list = await this.getAllCVMetadata();
    const filteredList = list.filter(item => item.id !== id);
    localStorage.setItem(CV_LIST_KEY, JSON.stringify(filteredList));
  }
}

// Singleton instance
export const storageService = new LocalStorageAdapter();
