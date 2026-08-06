'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../../components/layouts/Sidebar';
import Header from '../../components/layouts/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  // Derive title from pathname
  const getTitle = () => {
    const paths = pathname.split('/').filter(Boolean);
    if (paths.length === 0 || paths[0] === 'dashboard') return 'Dashboard';
    
    // Convert e.g. "admin" to "Admin Dashboard"
    const section = paths[0].charAt(0).toUpperCase() + paths[0].slice(1);
    if (paths.length === 1) return `${section} Dashboard`;
    
    // Sub-pages like /admin/slots -> "Admin - Slots"
    const sub = paths[1].charAt(0).toUpperCase() + paths[1].slice(1);
    return `${section} - ${sub}`;
  };

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex">
      <Sidebar user={user} />
      
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <Header title={getTitle()} user={user} />
        
        <main className="flex-1 overflow-y-auto p-gutter bg-background flex flex-col items-center">
          <div className="w-full max-w-container-max flex flex-col flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
