import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Globe, ChevronDown, Menu, X, Instagram, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
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
              <Link to="https://multipriority.com/" className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                  Tentang <ChevronDown className="w-4 h-4" />
                </div>
                {/* Dropdown Placeholder */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="py-2">
                    <Link to="https://multipriority.com/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Tentang Kami</Link>
                    <Link to="https://multipriority.com/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Visi & Misi</Link>
                    <Link to="https://multipriority.com/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Management Perseroan</Link>
                    <Link to="https://multipriority.com/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Struktur Perseroan</Link>
                  </div>
                </div>
              </div>
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                  Layanan Kami <ChevronDown className="w-4 h-4" />
                </div>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="py-2">
                    <Link to="https://smi.multipriority.com/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Edukasi & Pengembangan Talenta</Link>
                    <Link to="https://multipriority.com/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Telekomunikasi Digital</Link>
                    <Link to="https://multipriority.com/Product-Pusat-Laptop-Bekasi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Perdagangan Laptop & Ponsel</Link>
                    <Link to="https://multipriority.com/Product-IQICorps" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Jasa Digital & Branding</Link>
                    <Link to="https://multipriority.com/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Pariwisata & Manajemen Acara</Link>
                    <Link to="https://multipriority.com/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Desain & Percetakan Kreatif</Link>
                    <Link to="https://multipriority.com/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Produksi Kreatif & Hiburan</Link>
                  </div>
                </div>
              </div>
              <Link to="https://recruitment.multipriority.com/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Karir
              </Link>
              <Link to="https://multipriority.com/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
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
              <div className="py-2 space-y-1">
                <p className="px-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Layanan Kami</p>
                <Link to="https://multipriority.com/" className="block py-2 text-sm text-gray-600 hover:text-blue-600">Edukasi & Pengembangan Talenta</Link>
                <Link to="https://multipriority.com/" className="block py-2 text-sm text-gray-600 hover:text-blue-600">Telekomunikasi Digital</Link>
                <Link to="https://multipriority.com/" className="block py-2 text-sm text-gray-600 hover:text-blue-600">Perdagangan Laptop & Ponsel</Link>
                <Link to="https://multipriority.com/" className="block py-2 text-sm text-gray-600 hover:text-blue-600">Jasa Digital & Branding</Link>
                <Link to="https://multipriority.com/" className="block py-2 text-sm text-gray-600 hover:text-blue-600">Product IQI Corps</Link>
                <Link to="https://multipriority.com/" className="block py-2 text-sm text-gray-600 hover:text-blue-600">Pariwisata & Manajemen Acara</Link>
                <Link to="https://multipriority.com/" className="block py-2 text-sm text-gray-600 hover:text-blue-600">Desain & Percetakan Kreatif</Link>
                <Link to="https://multipriority.com/" className="block py-2 text-sm text-gray-600 hover:text-blue-600">Produksi Kreatif & Hiburan</Link>
              </div>
              <Link to="https://recruitment.multipriority.com/" className="block py-3 text-base font-medium text-gray-600 border-b border-gray-100">Karir</Link>
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
      <footer className="bg-[#0F172A] text-gray-300 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            {/* Column 1: Brand & Desc */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight">MPB Corps</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Multiusaha Prioritas Bersama</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
                Perusahaan induk yang membangun ekosistem bisnis berkelanjutan dan inovatif melalui sinergi berbagai unit usaha strategis.
              </p>
            </div>

            {/* Column 2: Unit Bisnis */}
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-xs font-black text-white uppercase tracking-[0.15em] relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-px after:bg-blue-500">Unit Bisnis</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 group cursor-pointer text-slate-400 hover:text-white transition-colors">
                  <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                  <span className="text-sm">Sekolah Mentor Indonesia</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Hubungi Kami */}
            <div className="lg:col-span-3 space-y-6">
              <h4 className="text-xs font-black text-white uppercase tracking-[0.15em] relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-px after:bg-blue-500">Hubungi Kami</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                  <div className="text-sm leading-snug text-slate-400">
                    <span className="block text-white font-medium mb-1 line-clamp-2">Bekasi, Jawa Barat, Indonesia</span>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                  <a href="tel:+6281915020498" className="text-sm text-slate-400 hover:text-white transition-colors">+62 819-1502-0498</a>
                </li>
                <li className="flex items-center gap-4">
                  <MessageCircle className="w-5 h-5 text-blue-500 shrink-0" />
                  <a href="https://wa.me/6281915020498" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors">+62 819-1502-0498</a>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                  <a href="mailto:multiusahaprioritasbersama@gmail.com" className="text-sm break-all text-slate-400 hover:text-white transition-colors">multiusahaprioritasbersama@gmail.com</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Perusahaan */}
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-xs font-black text-white uppercase tracking-[0.15em] relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-px after:bg-blue-500">Perusahaan</h4>
              <ul className="space-y-3">
                <li><Link to="https://multipriority.com/" className="text-sm hover:text-white transition-colors">Tentang Kami</Link></li>
                <li><Link to="https://multipriority.com/" className="text-sm hover:text-white transition-colors">Visi & Misi</Link></li>
                <li><Link to="https://multipriority.com/" className="text-sm hover:text-white transition-colors">Struktur Perseroan</Link></li>
                <li><Link to="https://multipriority.com/" className="text-sm hover:text-white transition-colors">Hubungi Kami</Link></li>
              </ul>
            </div>

            {/* Column 5: Legal */}
            <div className="lg:col-span-1 space-y-6">
              <h4 className="text-xs font-black text-white uppercase tracking-[0.15em] relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-px after:bg-blue-500">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="#" className="text-sm hover:text-white transition-colors">Kebijakan Privasi</Link></li>
                <li><Link to="#" className="text-sm hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} PT Multiusaha Prioritas Bersama. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              Powered by <span className="font-bold text-slate-400">MPB Group</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
