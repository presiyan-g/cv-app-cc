import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function Header() {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor');

  if (isEditor) return null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CV</span>
            </div>
            <span className="font-semibold text-xl text-gray-900">CV Creator</span>
          </Link>

          <nav className="flex items-center gap-6">
            <NavLink to="/templates">Templates</NavLink>
            <NavLink to="/dashboard">My CVs</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        'text-sm font-medium transition-colors',
        isActive ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
      )}
    >
      {children}
    </Link>
  );
}
