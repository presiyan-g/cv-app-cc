import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Modal, Input } from '../../components/ui';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { useDashboardStore } from '../../stores/dashboardStore';
import type { CVMetadata } from '../../features/cv/types';

export function DashboardPage() {
  const navigate = useNavigate();
  const { cvList, isLoading, loadCVList, deleteCV, renameCV, duplicateCV } = useDashboardStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [renameCV_, setRenameCV] = useState<CVMetadata | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadCVList();
  }, [loadCVList]);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCV(deleteId);
      setDeleteId(null);
    }
  };

  const handleRename = async () => {
    if (renameCV_ && newName.trim()) {
      await renameCV(renameCV_.id, newName.trim());
      setRenameCV(null);
      setNewName('');
    }
  };

  const handleDuplicate = async (id: string) => {
    const cv = await duplicateCV(id);
    if (cv) {
      navigate(`/editor/${cv.id}`);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="mt-1 text-gray-600">Manage and edit your resumes</p>
        </div>
        <Link to="/templates">
          <Button>Create New</Button>
        </Link>
      </div>

      {cvList.length === 0 ? (
        <Card>
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="No resumes yet"
            description="Create your first resume by choosing a template"
            action={
              <Link to="/templates">
                <Button>Choose a Template</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvList.map(cv => (
            <CVCard
              key={cv.id}
              cv={cv}
              onEdit={() => navigate(`/editor/${cv.id}`)}
              onExport={() => navigate(`/export/${cv.id}`)}
              onRename={() => {
                setRenameCV(cv);
                setNewName(cv.name);
              }}
              onDuplicate={() => handleDuplicate(cv.id)}
              onDelete={() => setDeleteId(cv.id)}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Resume"
        size="sm"
      >
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this resume? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={!!renameCV_}
        onClose={() => setRenameCV(null)}
        title="Rename Resume"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="New Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setRenameCV(null)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleRename} disabled={!newName.trim()}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

interface CVCardProps {
  cv: CVMetadata;
  onEdit: () => void;
  onExport: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  formatDate: (timestamp: number) => string;
}

function CVCard({ cv, onEdit, onExport, onRename, onDuplicate, onDelete, formatDate }: CVCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card padding="none" className="overflow-hidden group">
      {/* Preview placeholder */}
      <div
        className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 relative cursor-pointer"
        onClick={onEdit}
      >
        <div className="absolute inset-4 bg-white rounded shadow-sm border border-gray-200 p-3">
          <div className="w-10 h-1 bg-primary-600 rounded mb-2" />
          <div className="w-16 h-1 bg-gray-200 rounded mb-3" />
          <div className="space-y-1">
            <div className="w-full h-0.5 bg-gray-100 rounded" />
            <div className="w-3/4 h-0.5 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{cv.name}</h3>
            <p className="text-sm text-gray-500">Updated {formatDate(cv.updatedAt)}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <MenuItem onClick={() => { onEdit(); setShowMenu(false); }}>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={() => { onExport(); setShowMenu(false); }}>
                    Export PDF
                  </MenuItem>
                  <MenuItem onClick={() => { onRename(); setShowMenu(false); }}>
                    Rename
                  </MenuItem>
                  <MenuItem onClick={() => { onDuplicate(); setShowMenu(false); }}>
                    Duplicate
                  </MenuItem>
                  <div className="border-t border-gray-100 my-1" />
                  <MenuItem onClick={() => { onDelete(); setShowMenu(false); }} danger>
                    Delete
                  </MenuItem>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

interface MenuItemProps {
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
}

function MenuItem({ onClick, children, danger }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm ${
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}
