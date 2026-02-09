import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard,
  Briefcase,
  Users,
  UserCircle,
  Settings,
  LogOut,
  FileText,
  ClipboardList,
  UserCheck,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Bell
} from 'lucide-react';
import clsx from 'clsx';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Define navigation based on user role
  const adminNavigation = [
    { name: 'Dashboard', href: '/dashboard/admin/overview', icon: LayoutDashboard },
    { name: 'Profil Admin', href: '/dashboard/admin/profile', icon: UserCircle },
    { name: 'Kelola Lowongan', href: '/dashboard/admin/manage-jobs', icon: Briefcase },
    { name: 'Data Pelamar', href: '/dashboard/admin/applicants', icon: Users },
    { name: 'Psikotes', href: '/dashboard/admin/psychotest', icon: ClipboardList },
    { name: 'Notifikasi', href: '/dashboard/admin/notifications', icon: Bell },
  ];

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard/user/overview', icon: LayoutDashboard },
    { name: 'Data Diri', href: '/dashboard/user/profile', icon: UserCircle },
    { name: 'Dokumen', href: '/dashboard/user/documents', icon: FileText },
    { name: 'Lamaran Saya', href: '/dashboard/user/applications', icon: ClipboardList },
    { name: 'Notifikasi', href: '/dashboard/user/notifications', icon: Bell },
  ];

  const currentNavigation = user?.role === 'HR' ? adminNavigation : userNavigation;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get current page title
  const getCurrentPageName = () => {
    const activeItem = currentNavigation.find(item => location.pathname.startsWith(item.href));
    return activeItem ? activeItem.name : 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop & Mobile merged logic */}
      <aside 
        className={clsx(
          "bg-white border-r z-30 transition-all duration-300 ease-in-out flex flex-col",
          // Mobile: Fixed position, off-canvas
          isMobile ? "fixed inset-y-0 left-0 shadow-xl" : "relative",
          // Width control
          isSidebarOpen ? "w-64" : (isMobile ? "w-0 overflow-hidden" : "w-20"),
          // Mobile hide/show
          isMobile && !isSidebarOpen && "invisible"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-center border-b px-6">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            KARIR<span className="text-xs text-gray-500 font-normal ml-1">{user?.role === 'HR' ? 'Admin' : 'User'}</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {currentNavigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative",
                  isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  !isSidebarOpen && !isMobile && "justify-center"
                )}
                onClick={() => {
                  if (isMobile) setIsSidebarOpen(false);
                }}
              >
                <item.icon className={clsx("w-5 h-5 flex-shrink-0", isActive && "text-blue-600")} />
                
                <span className={clsx(
                  "font-medium whitespace-nowrap transition-all duration-300",
                  (!isSidebarOpen && !isMobile) ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
                )}>
                  {item.name}
                </span>

                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && !isMobile && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t mt-auto">
          {/* User Profile Snippet */}
          <div className={clsx(
            "flex items-center gap-3 mb-4 transition-all duration-300",
            (!isSidebarOpen && !isMobile) ? "justify-center" : ""
          )}>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className={clsx(
              "overflow-hidden transition-all duration-300",
              (!isSidebarOpen && !isMobile) ? "w-0 opacity-0" : "w-auto opacity-100"
            )}>
              <p className="text-base font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate uppercase">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={clsx(
              "flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors",
              (!isSidebarOpen && !isMobile) && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={clsx(
              "transition-all duration-300",
              (!isSidebarOpen && !isMobile) ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            )}>
              Keluar
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
            >
              {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-2 text-gray-800">
              <span className="text-lg font-semibold">{getCurrentPageName()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden sm:block text-gray-700">
                {user?.name}
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs ring-2 ring-white shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
