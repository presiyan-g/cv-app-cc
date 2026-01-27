import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCVStore } from '../../stores/cvStore';
import { LoadingSpinner } from '../../components/common';
import { Button } from '../../components/ui';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Canvas } from './components/Canvas/Canvas';
import { ControlsPanel } from './components/Controls/ControlsPanel';
import { ResizeHandle } from './components/ResizeHandle';
import { debounce } from '../../lib/utils';

const SIDEBAR_MIN_WIDTH = 280;
const SIDEBAR_MAX_WIDTH = 600;
const SIDEBAR_DEFAULT_WIDTH = 384;

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { cv, isDirty, isSaving, lastSaved, loadCV, save, saveRevision, reset } = useCVStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<'edit' | 'preview' | 'style'>('edit');
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('cv-editor-sidebar-width');
    return saved ? Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, parseInt(saved, 10))) : SIDEBAR_DEFAULT_WIDTH;
  });

  useEffect(() => {
    if (id) {
      loadCV(id).then(() => setIsLoading(false));
    }
    return () => reset();
  }, [id, loadCV, reset]);

  // Autosave with debounce
  const debouncedSave = useCallback(
    debounce(async () => {
      await save();
      await saveRevision();
    }, 3000),
    [save, saveRevision]
  );

  useEffect(() => {
    if (isDirty) {
      debouncedSave();
    }
  }, [isDirty, debouncedSave]);

  // Save on window blur
  useEffect(() => {
    const handleBlur = () => {
      if (isDirty) {
        save();
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [isDirty, save]);

  // Persist sidebar width
  useEffect(() => {
    localStorage.setItem('cv-editor-sidebar-width', String(sidebarWidth));
  }, [sidebarWidth]);

  // Handle sidebar resize
  const handleSidebarResize = useCallback((delta: number) => {
    setSidebarWidth(prev => Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, prev + delta)));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Resume not found</p>
        <Link to="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const date = new Date(lastSaved);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Editor Header */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="min-w-0">
            <h1 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{cv.name}</h1>
            <p className="text-xs text-gray-500 truncate">
              {isSaving ? 'Saving...' : isDirty ? 'Unsaved changes' : lastSaved ? `Saved at ${formatLastSaved()}` : 'Saved'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Button variant="outline" size="sm" onClick={() => save()} disabled={!isDirty || isSaving} className="hidden sm:inline-flex">
            Save
          </Button>
          <Link to={`/export/${cv.id}`}>
            <Button size="sm" className="text-xs sm:text-sm">Export PDF</Button>
          </Link>
        </div>
      </header>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar with resize handle */}
        <div
          className={`relative shrink-0 w-full lg:w-auto ${
            activePanel === 'edit' ? 'flex' : 'hidden lg:flex'
          }`}
          style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
        >
          <div
            className="w-full lg:w-[var(--sidebar-width)] bg-white border-r border-gray-200 overflow-y-auto pb-16 lg:pb-0"
          >
            <Sidebar />
          </div>
          <ResizeHandle onResize={handleSidebarResize} />
        </div>

        {/* Canvas (Preview) */}
        <div className={`flex-1 overflow-y-auto p-4 lg:p-8 pb-20 lg:pb-8 ${
          activePanel === 'preview' ? 'block' : 'hidden lg:block'
        }`}>
          <Canvas />
        </div>

        {/* Controls Panel */}
        <div className={`w-full lg:w-72 bg-white border-l border-gray-200 overflow-y-auto shrink-0 pb-16 lg:pb-0 ${
          activePanel === 'style' ? 'block' : 'hidden lg:block'
        }`}>
          <ControlsPanel />
        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
          <div className="flex">
            <button
              onClick={() => setActivePanel('edit')}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-4 ${
                activePanel === 'edit' ? 'text-primary-600 bg-primary-50' : 'text-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-xs mt-1">Edit</span>
            </button>
            <button
              onClick={() => setActivePanel('preview')}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-4 ${
                activePanel === 'preview' ? 'text-primary-600 bg-primary-50' : 'text-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs mt-1">Preview</span>
            </button>
            <button
              onClick={() => setActivePanel('style')}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-4 ${
                activePanel === 'style' ? 'text-primary-600 bg-primary-50' : 'text-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="text-xs mt-1">Style</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
