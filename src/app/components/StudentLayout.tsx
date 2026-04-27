import React, { ReactNode, useState, useEffect } from 'react';
import { GraduationCap, ShoppingCart, Bell, User, Upload, ShoppingBag, Wallet as WalletIcon, Crown, Settings, LogOut, MessageSquare, Edit, ChevronDown, Star } from 'lucide-react';
import { useMockData } from '../utils/MockDataContext';
import { NavigationTab, Screen } from '../App';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

type StudentLayoutProps = {
  children: ReactNode;
  onCartClick?: () => void;
  onNotificationsClick?: () => void;
  activeTab?: NavigationTab;
  onTabChange?: (tab: NavigationTab) => void;
  onNavigate?: (screen: Screen) => void;
  onLogout?: () => void;
  currentPage?: Screen;
};

export function StudentLayout({ children, onCartClick, onNotificationsClick, activeTab = 'home', onTabChange, onNavigate, onLogout, currentPage }: StudentLayoutProps) {
  const mockData = useMockData();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [sellerRating, setSellerRating] = useState(0);

  // Check if current page is a dashboard page
  const dashboardPages: Screen[] = ['profile', 'edit-profile', 'history', 'feedback', 'membership', 'settings'];
  const isDashboardActive = currentPage ? dashboardPages.includes(currentPage) : activeTab === 'profile';

  useEffect(() => {
    // Get cart items count
    const cartItems = mockData.getCartItems();
    setCartItemCount(cartItems.length);

    // Get unread notifications count
    const notifications = mockData.getNotifications();
    const unreadCount = notifications.filter(n => !n.isRead).length;
    setNotificationCount(unreadCount);

    // Get seller rating
    const rating = mockData.getSellerRating();
    setSellerRating(rating);
  }, [mockData]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      {/* Top Header Bar */}
      <header className="shadow-sm border-b sticky top-0 z-40 bg-white">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side - Logo and Name */}
            <button
              onClick={() => {
                if (onTabChange) {
                  onTabChange('home');
                }
              }}
              className="flex items-center gap-4 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: '#E56E20' }}>
                <GraduationCap size={28} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#E56E20' }}>
                  Pass The Paper
                </h1>
                <p className="text-sm text-gray-500">Academic Resources Marketplace</p>
              </div>
            </button>

            {/* Right side - Notifications, Cart, and Profile Picture */}
            <div className="flex items-center gap-4">
              <button
                onClick={onNotificationsClick}
                className="relative p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              >
                <Bell size={26} style={{ color: '#E56E20' }} />
                {notificationCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-semibold shadow-lg animate-pulse"
                    style={{ backgroundColor: '#E56E20' }}
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
              <button
                onClick={onCartClick}
                className="relative p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              >
                <ShoppingCart size={26} style={{ color: '#E56E20' }} />
                {cartItemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-semibold shadow-lg"
                    style={{ backgroundColor: '#E56E20' }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              {/* Profile Picture with Seller Rating */}
              <div className="flex flex-col items-center">
                <div 
                  className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
                  style={{ 
                    border: `3px solid ${mockData.currentUser?.isVerified ? '#10B981' : '#EF4444'}`,
                    backgroundColor: '#F3F4F6'
                  }}
                  onClick={() => onNavigate && onNavigate('profile')}
                >
                  {mockData.currentUser?.profilePicture ? (
                    <img 
                      src={mockData.currentUser.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={28} className="text-gray-600" />
                  )}
                </div>
                {/* Seller Rating */}
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} fill="#FCD34D" stroke="#FCD34D" />
                  <span className="text-xs font-semibold text-gray-700">
                    {sellerRating > 0 ? sellerRating.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar - Now at the top */}
        <div className="bg-white border-t">
          <div className="max-w-[1800px] mx-auto px-8">
            <div className="flex justify-around items-center h-16">
              {/* Regular Navigation Buttons */}
              {[
                { id: 'home' as NavigationTab, label: 'Home', icon: '🏠' },
                { id: 'browse' as NavigationTab, label: 'Browse', icon: '🔍' },
                { id: 'upload' as NavigationTab, label: 'Upload', icon: '📤' },
                { id: 'wallet' as NavigationTab, label: 'Wallet', icon: '💰' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange && onTabChange(tab.id)}
                  className={`flex flex-col items-center justify-center px-8 py-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                    activeTab === tab.id ? 'text-[#E56E20] bg-[#FFF5F0]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-3xl mb-1">{tab.icon}</span>
                  <span className="text-sm font-semibold">{tab.label}</span>
                </button>
              ))}
              
              {/* Dashboard Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex flex-col items-center justify-center px-8 py-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                      isDashboardActive ? 'text-[#E56E20] bg-[#FFF5F0]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl mb-1">📊</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold">Dashboard</span>
                      <ChevronDown size={14} />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuItem
                    onClick={() => onNavigate && onNavigate('profile')}
                    className="cursor-pointer"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate && onNavigate('edit-profile')}
                    className="cursor-pointer"
                  >
                    <Edit size={16} />
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate && onNavigate('history')}
                    className="cursor-pointer"
                  >
                    <Upload size={16} />
                    <span>My Uploads</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate && onNavigate('history')}
                    className="cursor-pointer"
                  >
                    <ShoppingBag size={16} />
                    <span>Purchase History</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate && onNavigate('feedback')}
                    className="cursor-pointer"
                  >
                    <MessageSquare size={16} />
                    <span>Feedback</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate && onNavigate('membership')}
                    className="cursor-pointer"
                  >
                    <Crown size={16} />
                    <span>Membership</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate && onNavigate('settings')}
                    className="cursor-pointer"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer"
                    variant="destructive"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Bottom Navigation removed - now at top */}
    </div>
  );
}