import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Globe, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';

const PublicLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#0F172A] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 leading-none mb-1">MPB Corps</span>
              <span className="text-[10px] font-medium text-gray-500 tracking-wide">Multiusaha Prioritas Bersama</span>
            </div>
          </Link>

          {/* Right: Navigation and Actions */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                  Tentang <ChevronDown className="w-4 h-4" />
                </div>
                {/* Dropdown Placeholder */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="py-2">
                    <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Tentang Kami</Link>
                    <Link to="/vision" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Visi & Misi</Link>
                  </div>
                </div>
              </div>
              <Link to="/#karir-section" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Karir
              </Link>
              <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Hubungi Kami
              </Link>
            </nav>



            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors focus:outline-none">
                  {user?.photo ? (
                    <img src={`${window.API_BASE_URL}${user.photo}`} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      Dashboard
                    </Link>
                    <Link to={user?.role === 'ADMIN' ? "/dashboard/admin/profile" : "/dashboard/user/settings"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm hover:shadow-blue-500/30">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" className="block py-3 text-base font-medium text-gray-900 border-b border-gray-100">Home</Link>
              <Link to="/#karir-section" className="block py-3 text-base font-medium text-gray-600 border-b border-gray-100">Karir</Link>
              <Link to="/contact" className="block py-3 text-base font-medium text-gray-600 border-b border-gray-100">Hubungi Kami</Link>

              {!isAuthenticated && (
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <Link to="/login" className="flex justify-center py-2.5 text-sm font-bold text-gray-700 border border-gray-300 rounded-lg">
                    Login
                  </Link>
                  <Link to="/register" className="flex justify-center py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Karir Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
