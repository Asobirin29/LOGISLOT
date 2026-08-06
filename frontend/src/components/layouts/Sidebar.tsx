'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  user: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems: Record<string, { label: string; icon: string; path: string }[]> = {
    supplier: [
      { label: 'Home', icon: 'dashboard', path: '/supplier' },
      { label: 'Create Booking', icon: 'add_box', path: '/supplier/booking/create' },
      { label: 'My Bookings', icon: 'list_alt', path: '/supplier/bookings' },
      { label: 'History', icon: 'history', path: '/supplier/history' },
    ],
    admin: [
      { label: 'Home', icon: 'dashboard', path: '/admin' },
      { label: 'Time Slot & Kuota', icon: 'date_range', path: '/admin/slots' },
      { label: 'Manajemen Loading Dock', icon: 'local_shipping', path: '/admin/docks' },
      { label: 'Manajemen User', icon: 'people', path: '/admin/users' },
      { label: 'Audit Log', icon: 'manage_history', path: '/admin/audit' },
    ],
    security: [
      { label: 'Check-In/Out', icon: 'door_front', path: '/security' },
      { label: 'Antrean Harian', icon: 'list_alt', path: '/security/queue' },
    ],
    warehouse: [
      { label: 'Dashboard', icon: 'dashboard', path: '/warehouse' },
      { label: 'Denah Loading Dock', icon: 'map', path: '/warehouse/map' },
      { label: 'Verifikasi Bongkar/Muat', icon: 'check_circle', path: '/warehouse/verify' },
    ],
    ic: [
      { label: 'Monitoring Kedatangan', icon: 'monitoring', path: '/ic' },
      { label: 'Laporan SLA', icon: 'analytics', path: '/ic/reports' },
    ]
  };

  const currentMenu = menuItems[user?.role || 'supplier'] || menuItems.supplier;

  return (
    <aside className="bg-primary font-body-md text-body-md w-64 fixed left-0 top-0 border-r border-outline-variant flex flex-col h-full py-lg z-20">
      <div className="px-md mb-xl flex items-center gap-sm">
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary-container text-[20px]">local_shipping</span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-on-primary">LOGISLOT</h1>
          <p className="text-xs text-on-primary-container opacity-80 uppercase tracking-widest">{user?.role} Portal</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-sm px-xs" data-tour="sidebar-menu">
        {currentMenu.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`rounded-lg mx-2 my-1 flex items-center gap-md px-md py-sm transition-colors duration-200 ease-in-out ${
                isActive 
                  ? 'bg-primary-container text-on-primary-container' 
                  : 'text-on-primary hover:bg-on-primary-fixed-variant'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-xs space-y-sm" data-tour="sidebar-help-settings">
        <Link href="/settings" className="text-on-primary hover:bg-on-primary-fixed-variant rounded-lg mx-2 my-1 flex items-center gap-md px-md py-sm transition-colors duration-200 ease-in-out">
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </Link>
        <Link href="/support" className="text-on-primary hover:bg-on-primary-fixed-variant rounded-lg mx-2 my-1 flex items-center gap-md px-md py-sm transition-colors duration-200 ease-in-out">
          <span className="material-symbols-outlined">help_outline</span>
          <span>Support</span>
        </Link>
      </div>

      <div className="mt-lg border-t border-on-primary-fixed-variant p-md flex items-center gap-md" data-tour="sidebar-profile-card">
        <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold uppercase">
          {user?.nama ? user.nama.substring(0, 2) : 'US'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate font-bold text-on-primary">{user?.nama}</p>
          <p className="text-xs text-on-primary-container truncate capitalize">{user?.role}</p>
        </div>
        <button onClick={logout} className="text-on-primary-container hover:text-white">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </aside>
  );
}
