'use client';

import { useState } from 'react';

interface UserItem {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  division: string;
  role: 'Supplier' | 'Inventory Control' | 'Security' | 'Warehouse' | 'Admin';
  isActive: boolean;
}

const INITIAL_USERS: UserItem[] = [
  { id: '1', name: 'Ahmad Wijaya', initials: 'AW', email: 'ahmad.w@ptsinar.com', phone: '+62 812-3456-7890', division: 'PT Sinar Gemilang', role: 'Supplier', isActive: true },
  { id: '2', name: 'Budi Santoso', initials: 'BS', email: 'budi.ic@logislot.com', phone: '+62 813-9876-5432', division: 'Divisi Inventory Pusat', role: 'Inventory Control', isActive: true },
  { id: '3', name: 'Citra Hapsari', initials: 'CH', email: 'citra.sec@logislot.com', phone: '+62 811-2233-4455', division: 'Pos Security Gerbang Utama', role: 'Security', isActive: true },
  { id: '4', name: 'Dedi Pratama', initials: 'DP', email: 'dedi.wh@logislot.com', phone: '+62 815-6677-8899', division: 'Gudang A - Bahan Baku', role: 'Warehouse', isActive: false },
  { id: '5', name: 'Eko Kurniawan', initials: 'EK', email: 'admin@logislot.com', phone: '+62 818-0011-2233', division: 'IT & System Control', role: 'Admin', isActive: true },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [selectedRoleTab, setSelectedRoleTab] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer / Modal states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Warehouse' as UserItem['role'],
    division: 'wh_a',
    sendEmail: true
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Warehouse',
      division: 'Gudang A - Bahan Baku',
      sendEmail: true
    });
    setEditingUser(null);
    setIsAddUserOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      division: user.division,
      sendEmail: false
    });
    setIsAddUserOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Harap isi Nama dan Email!');
      return;
    }

    if (editingUser) {
      // Update
      setUsers(prev => prev.map(u => u.id === editingUser.id ? {
        ...u,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        division: formData.division
      } : u));
      showToast(`User ${formData.name} berhasil diperbarui!`);
    } else {
      // Create
      const initials = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'US';
      const newUser: UserItem = {
        id: String(Date.now()),
        name: formData.name,
        initials,
        email: formData.email,
        phone: formData.phone || '+62 800-0000-0000',
        division: formData.division || 'Umum',
        role: formData.role,
        isActive: true
      };
      setUsers(prev => [newUser, ...prev]);
      showToast(`User baru ${formData.name} berhasil ditambahkan!`);
    }

    setIsAddUserOpen(false);
    setEditingUser(null);
  };

  const handleToggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    const target = users.find(u => u.id === id);
    if (target) {
      showToast(`Status user ${target.name} diubah menjadi ${!target.isActive ? 'Aktif' : 'Non-aktif'}`);
    }
  };

  const handleDeleteUser = () => {
    if (deletingUser) {
      setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
      showToast(`User ${deletingUser.name} telah dihapus!`);
      setDeletingUser(null);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRoleTab === 'Semua' || user.role === selectedRoleTab;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.division.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleBadgeStyle = (role: UserItem['role']) => {
    switch (role) {
      case 'Supplier': return 'bg-[#d6e3ff] text-[#001b3d]';
      case 'Inventory Control': return 'bg-[#f3e8ff] text-[#581c87]';
      case 'Security': return 'bg-[#ffedd5] text-[#9a3412]';
      case 'Warehouse': return 'bg-[#ccfbf1] text-[#115e59]';
      case 'Admin': return 'bg-[#1b365d] text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-primary-container text-on-primary px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      {/* Top App Bar */}
      <header className="flex justify-between items-center px-lg py-lg w-full sticky top-0 z-30 bg-[#F4F6F9] border-b border-outline-variant">
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary">Manajemen User</h2>
        <div className="flex items-center gap-md">
          <button 
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-2 px-4 rounded-lg flex items-center gap-sm transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Tambah User Baru
          </button>
        </div>
      </header>
      
      {/* Page Content */}
      <div className="flex-1 overflow-auto p-lg">
        <div className="max-w-[1440px] mx-auto space-y-lg">
          {/* Filters & Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md bg-surface p-md rounded-xl border border-outline-variant shadow-sm">
            {/* Role Tabs */}
            <div className="flex flex-wrap items-center gap-sm">
              {['Semua', 'Supplier', 'Inventory Control', 'Security', 'Warehouse', 'Admin'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedRoleTab(tab)}
                  className={`px-4 py-1.5 rounded-full font-label-md text-label-md border transition-colors ${
                    selectedRoleTab === tab 
                      ? 'bg-primary text-on-primary border-primary' 
                      : 'bg-transparent text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg font-body-md text-body-md bg-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-shadow" 
                placeholder="Cari user..." 
                type="text" 
              />
            </div>
          </div>
          
          {/* User Data Table */}
          <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col">
            <div className="overflow-x-auto w-full" style={{scrollbarWidth: 'thin'}}>
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Nama</th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Email</th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Instansi/Divisi</th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Role</th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-body-md text-body-md bg-white">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                        Tidak ada user ditemukan matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-surface-container-low transition-colors group">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm">
                            {user.initials}
                          </div>
                          <span className="font-semibold text-on-surface">{user.name}</span>
                        </td>
                        <td className="py-3 px-4 text-on-surface-variant">{user.email}</td>
                        <td className="py-3 px-4 text-on-surface">{user.division}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getRoleBadgeStyle(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`w-11 h-6 rounded-full p-1 transition-colors relative flex items-center ${
                              user.isActive ? 'bg-emerald-500 justify-end' : 'bg-gray-300 justify-start'
                            }`}
                            title={user.isActive ? 'User Aktif' : 'User Non-aktif'}
                          >
                            <span className="w-4 h-4 rounded-full bg-white shadow-sm block"></span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                          <button 
                            onClick={() => handleOpenEdit(user)}
                            className="text-outline hover:text-primary transition-colors p-1"
                            title="Edit User"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button 
                            onClick={() => setDeletingUser(user)}
                            className="text-outline hover:text-error transition-colors p-1"
                            title="Hapus User"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Info */}
            <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface">
              <span className="font-body-md text-on-surface-variant text-sm">
                Menampilkan 1-{filteredUsers.length} dari {users.length} user
              </span>
              <div className="flex gap-2">
                <button className="p-1 rounded border border-outline-variant text-outline hover:text-on-surface hover:bg-surface-container-low disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="p-1 rounded border border-outline-variant text-outline hover:text-on-surface hover:bg-surface-container-low disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay & Slide-in Panel for "Tambah / Edit User" */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsAddUserOpen(false)}></div>
          
          <form onSubmit={handleSaveUser} className="relative w-full max-w-[460px] bg-surface h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-outline-variant z-10">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-lg border-b border-outline-variant bg-white">
              <h3 className="font-headline-md text-headline-md font-bold text-primary">
                {editingUser ? 'Edit Data User' : 'Tambah User Baru'}
              </h3>
              <button type="button" onClick={() => setIsAddUserOpen(false)} className="text-outline hover:text-on-surface rounded-full p-1 hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* Panel Form Content */}
            <div className="flex-1 overflow-y-auto p-lg space-y-lg bg-[#F8F9FF]">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface">Nama Lengkap <span className="text-error">*</span></label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md bg-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-shadow" 
                  placeholder="Masukkan nama lengkap" 
                  type="text" 
                />
              </div>
              
              {/* Email */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface">Email Aktif <span className="text-error">*</span></label>
                <input 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md bg-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-shadow" 
                  placeholder="contoh@domain.com" 
                  type="email" 
                />
              </div>
              
              {/* Nomor Telepon */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface">Nomor Telepon</label>
                <input 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md bg-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-shadow" 
                  placeholder="+62 8..." 
                  type="tel" 
                />
              </div>
              
              {/* Role Dropdown */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface">Role Internal <span className="text-error">*</span></label>
                <div className="relative">
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as UserItem['role']})}
                    className="w-full pl-3 pr-10 py-2 border border-outline-variant rounded-lg font-body-md text-body-md bg-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary appearance-none transition-shadow text-on-surface"
                  >
                    <option value="Supplier">Supplier</option>
                    <option value="Inventory Control">Inventory Control</option>
                    <option value="Security">Security</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>
              
              {/* Instansi/Divisi */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface">Instansi/Divisi Penempatan <span className="text-error">*</span></label>
                <input
                  value={formData.division}
                  onChange={(e) => setFormData({...formData, division: e.target.value})}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md bg-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-shadow"
                  placeholder="Contoh: Gudang A / Pos 1 / PT Sinar"
                />
              </div>
            </div>
            
            {/* Panel Footer Actions */}
            <div className="p-lg border-t border-outline-variant bg-white flex justify-end gap-md">
              <button type="button" onClick={() => setIsAddUserOpen(false)} className="px-6 py-2 rounded-lg border border-secondary text-secondary font-label-md text-label-md hover:bg-surface-container-low transition-colors">
                Batal
              </button>
              <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm">
                {editingUser ? 'Simpan Perubahan' : 'Simpan User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setDeletingUser(null)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-[460px] p-6 shadow-2xl z-10 border border-outline-variant">
            <h3 className="font-headline-md text-headline-md font-bold text-error mb-2">Konfirmasi Hapus User</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Apakah Anda yakin ingin menghapus user <strong>{deletingUser.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeletingUser(null)} className="px-4 py-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label-md">
                Batal
              </button>
              <button onClick={handleDeleteUser} className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 font-label-md shadow-sm">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

