import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white h-16 py-3 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="IACG Multimedia College"
          className="h-12 w-auto object-contain"
        />
      </div>

      {user && (
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-brand-navy">{user.name}</p>
            <p className="text-xs text-gray-500 font-medium">
              {user.studentClass ? `${user.studentClass} • ` : ''}{user.school}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-semibold"
            title="Exit Assessment"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Exit</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
