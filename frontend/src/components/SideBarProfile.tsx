import React, { useState } from 'react';
import { MoreVertical, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProfileProps {
  onClose?: () => void;
}

export const SidebarProfile: React.FC<SidebarProfileProps> = ({ onClose }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitialColor = () => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      if (onClose) onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowDropdown(false);
    if (onClose) onClose();
  };

  if (!user) return null;

  const defaultUserName = 'Guest'; // Or any default value

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getInitialColor()} text-white text-lg font-semibold`}>
            {user?.name?.charAt(0)?.toUpperCase() || defaultUserName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{user.name}</span>
            <span className="text-sm text-gray-500">{user.phoneNumber}</span>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>

          {showDropdown && (
            <div className="absolute bottom-full right-0 mb-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleProfileClick}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};