import { useLocation } from 'react-router-dom';

export function Footer() {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor');

  if (isEditor) return null;

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">CV</span>
            </div>
            <span className="text-gray-600 text-sm">CV Creator</span>
          </div>
          <p className="text-gray-500 text-sm">
            Build professional resumes with ease. All data stored locally.
          </p>
        </div>
      </div>
    </footer>
  );
}
