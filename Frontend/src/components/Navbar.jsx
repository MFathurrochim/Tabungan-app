import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, CurrencyDollarIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const TargetIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <circle cx="12" cy="12" r="8" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2" strokeWidth="1.5" />
  </svg>
);

const Navbar = () => {
  const location = useLocation();
  
  useEffect(() => {
    // dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }, []);

  const navItems = [
    { path: '/', label: 'Beranda', icon: HomeIcon },
    { path: '/transaksi', label: 'Transaksi', icon: CurrencyDollarIcon },
    { path: '/target', label: 'Target', icon: TargetIcon },
    { path: '/jadwal', label: 'Jadwal', icon: CalendarIcon },
    { path: '/statistik', label: 'Statistik', icon: ChartBarIcon },
  ];

  // Navlink untuk tampilan mobile
  const MobileNavLink = ({ path, label, icon: Icon }) => (
    <Link 
      to={path} 
      className={`flex flex-col items-center justify-center p-2 ${location.pathname === path ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs">{label}</span>
    </Link>
  );

  // Navlink untuk tampilan desktop
  const DesktopNavLink = ({ path, label, icon: Icon }) => (
    <Link 
      to={path} 
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        location.pathname === path 
          ? 'bg-primary/10 text-primary' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-light'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      {/* Desktop Navbar - sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-light pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold text-primary">TabunganKu</h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-2">
              {navItems.map((item) => (
                <DesktopNavLink key={item.path} {...item} />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed inset-x-0 bottom-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-light md:hidden z-10">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <MobileNavLink key={item.path} {...item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;