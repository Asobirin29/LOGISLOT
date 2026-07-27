'use client';

import { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { useAuth } from '../../../../context/AuthContext';
import { 
  fetchUsers, createUser, updateUser, toggleUserStatus, AdminUser,
  fetchDocks, createDock, updateDock, toggleDockStatus, AdminDock,
  fetchTimeSlots, createTimeSlot, updateTimeSlot, AdminTimeSlot,
  fetchAuditLogs, AuditLog,
  fetchSystemHealth, SystemHealth
} from '../../../../lib/admin';
import { 
  Shield, Users, UserPlus, Power, CheckCircle2, XCircle, LogOut, 
  Package, Clock, FileText, Activity, Search, Filter, Edit, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'docks' | 'slots' | 'audit' | 'health'>('users');

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans">
        {/* Navbar */}
        <header className="bg-[#1B365D] text-white shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-emerald-400" />
              <h1 className="text-xl font-bold tracking-tight">LOGISLOT <span className="font-light text-emerald-400">Admin</span></h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300 hidden md:inline-block">Halo, {user?.nama}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 space-y-1">
              <SidebarItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18} />} label="Manajemen User" />
              <SidebarItem active={activeTab === 'docks'} onClick={() => setActiveTab('docks')} icon={<Package size={18} />} label="Loading Dock" />
              <SidebarItem active={activeTab === 'slots'} onClick={() => setActiveTab('slots')} icon={<Clock size={18} />} label="Time Slot & Kuota" />
              <SidebarItem active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} icon={<FileText size={18} />} label="Audit Log" />
              <SidebarItem active={activeTab === 'health'} onClick={() => setActiveTab('health')} icon={<Activity size={18} />} label="Kesehatan Sistem" />
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === 'users' && <TabUsers />}
            {activeTab === 'docks' && <TabDocks />}
            {activeTab === 'slots' && <TabSlots />}
            {activeTab === 'audit' && <TabAudit />}
            {activeTab === 'health' && <TabHealth />}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function SidebarItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-[#1B365D] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ==============================================
// TAB: USERS
// ==============================================
function TabUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [modal, setModal] = useState<{ type: 'create' | 'edit', user?: AdminUser } | null>(null);
  const [formData, setFormData] = useState({ nama: '', email: '', password: '', role: 'ic' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUsers(filterRole === 'all' ? undefined : filterRole);
      setUsers(data);
    } catch (e) { toast.error('Gagal memuat pengguna'); }
    finally { setLoading(false); }
  }, [filterRole]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modal?.type === 'create') {
        await createUser(formData);
        toast.success('User dibuat');
      } else if (modal?.type === 'edit' && modal.user) {
        await updateUser(modal.user.id, { nama: formData.nama, email: formData.email, role: formData.role });
        toast.success('User diperbarui');
      }
      setModal(null);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan user');
    }
  };

  const openCreate = () => {
    setFormData({ nama: '', email: '', password: '', role: 'ic' });
    setModal({ type: 'create' });
  };
  const openEdit = (u: AdminUser) => {
    setFormData({ nama: u.nama, email: u.email, password: '', role: u.role });
    setModal({ type: 'edit', user: u });
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen User</h2>
        <button onClick={openCreate} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-700">
          <UserPlus size={16} /> Tambah User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto">
          {['all', 'supplier', 'ic', 'security', 'warehouse', 'admin'].map(r => (
            <button key={r} onClick={() => setFilterRole(r)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                filterRole === r ? 'bg-[#1B365D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r === 'all' ? 'Semua Role' : r}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Nama / Email</th>
                <th className="px-4 py-3 font-semibold">Instansi</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan={5} className="p-6 text-center text-gray-400">Loading...</td></tr> : 
                users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-bold text-gray-900">{u.nama}</div>
                    <div className="text-gray-500 text-xs">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{u.nama_instansi}</td>
                  <td className="px-4 py-3"><span className="uppercase text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{u.role}</span></td>
                  <td className="px-4 py-3">
                    {u.is_active ? <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={14}/> Aktif</span> : <span className="text-red-500 font-bold flex items-center gap-1"><XCircle size={14}/> Nonaktif</span>}
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button onClick={() => openEdit(u)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit size={16}/></button>
                    <button onClick={async () => {
                      if(confirm('Ubah status user?')) {
                        await toggleUserStatus(u.id); load(); toast.success('Status diubah');
                      }
                    }} className={`p-1.5 rounded ${u.is_active ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}>
                      <Power size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b font-bold text-gray-800">{modal.type === 'create' ? 'Tambah User' : 'Edit User'}</div>
            <div className="p-4 space-y-4">
              <div><label className="text-sm font-semibold">Nama</label><input required type="text" value={formData.nama} onChange={e=>setFormData({...formData, nama: e.target.value})} className="w-full border p-2 rounded mt-1"/></div>
              <div><label className="text-sm font-semibold">Email</label><input required type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full border p-2 rounded mt-1"/></div>
              {modal.type === 'create' && (
                <div><label className="text-sm font-semibold">Password</label><input required type="password" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="w-full border p-2 rounded mt-1"/></div>
              )}
              <div><label className="text-sm font-semibold">Role</label>
                <select value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})} className="w-full border p-2 rounded mt-1">
                  <option value="ic">IC</option>
                  <option value="security">Security</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-2 border-t">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 border rounded font-medium text-gray-600 hover:bg-gray-100">Batal</button>
              <button type="submit" className="px-4 py-2 bg-[#1B365D] text-white rounded font-medium">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ==============================================
// TAB: DOCKS
// ==============================================
function TabDocks() {
  const [docks, setDocks] = useState<AdminDock[]>([]);
  const [modal, setModal] = useState<{ type: 'create'|'edit', dock?: AdminDock} | null>(null);
  const [formData, setFormData] = useState({ nama_dock: '', deskripsi: '', kapasitas_maksimal: 1 });

  const load = useCallback(async () => {
    const data = await fetchDocks();
    setDocks(data);
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if(modal?.type === 'create') await createDock(formData);
      else if (modal?.type === 'edit' && modal.dock) await updateDock(modal.dock.id, formData);
      toast.success('Tersimpan');
      setModal(null); load();
    } catch(e) { toast.error('Gagal'); }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Loading Dock</h2>
        <button onClick={() => { setFormData({ nama_dock: '', deskripsi: '', kapasitas_maksimal: 1}); setModal({ type: 'create'}); }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-700">
          <Plus size={16} /> Tambah Dock
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docks.map(d => (
          <div key={d.id} className={`p-4 rounded-xl border-2 ${d.status === 'active' ? 'border-emerald-200 bg-white' : 'border-gray-300 bg-gray-100'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-xl text-gray-800">{d.nama_dock}</h3>
                <p className="text-xs text-gray-500 mt-1">{d.deskripsi || 'Tidak ada deskripsi'}</p>
                <p className="text-sm font-bold mt-2 text-[#1B365D]">Kapasitas: {d.kapasitas_maksimal}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${d.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-300 text-gray-700'}`}>
                {d.status.toUpperCase()}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => { setFormData({ nama_dock: d.nama_dock, deskripsi: d.deskripsi || '', kapasitas_maksimal: d.kapasitas_maksimal}); setModal({ type: 'edit', dock: d}); }} className="flex-1 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 font-medium">Edit</button>
              <button onClick={async () => {
                if(confirm('Ubah status dock?')) { await toggleDockStatus(d.id); load(); }
              }} className={`flex-1 py-1.5 border rounded text-sm font-medium ${d.status === 'active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}>
                {d.status === 'active' ? 'Set Maintenance' : 'Set Active'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-sm p-4 space-y-4">
            <h3 className="font-bold text-lg">{modal.type === 'create' ? 'Tambah Dock' : 'Edit Dock'}</h3>
            <div><label className="text-sm font-semibold">Nama Dock</label><input required type="text" value={formData.nama_dock} onChange={e=>setFormData({...formData, nama_dock: e.target.value})} className="w-full border p-2 rounded mt-1"/></div>
            <div><label className="text-sm font-semibold">Deskripsi</label><input type="text" value={formData.deskripsi} onChange={e=>setFormData({...formData, deskripsi: e.target.value})} className="w-full border p-2 rounded mt-1"/></div>
            <div><label className="text-sm font-semibold">Kapasitas</label><input required type="number" min="1" value={formData.kapasitas_maksimal} onChange={e=>setFormData({...formData, kapasitas_maksimal: parseInt(e.target.value)})} className="w-full border p-2 rounded mt-1"/></div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setModal(null)} className="flex-1 border p-2 rounded font-medium hover:bg-gray-50">Batal</button>
              <button type="submit" className="flex-1 bg-[#1B365D] text-white p-2 rounded font-medium">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ==============================================
// TAB: TIME SLOTS
// ==============================================
function TabSlots() {
  const [slots, setSlots] = useState<AdminTimeSlot[]>([]);
  const [modal, setModal] = useState<{ type: 'create'|'edit', slot?: AdminTimeSlot} | null>(null);
  const [formData, setFormData] = useState({ jam_mulai: '', jam_selesai: '', kuota_maksimal: 1 });

  const load = useCallback(async () => {
    const data = await fetchTimeSlots();
    setSlots(data);
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if(modal?.type === 'create') await createTimeSlot(formData);
      else if (modal?.type === 'edit' && modal.slot) await updateTimeSlot(modal.slot.id, formData);
      toast.success('Tersimpan');
      setModal(null); load();
    } catch(e) { toast.error('Gagal'); }
  };

  const formatT = (iso: string) => iso.substring(11,16);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Time Slot</h2>
        <button onClick={() => { setFormData({ jam_mulai: '', jam_selesai: '', kuota_maksimal: 1}); setModal({ type: 'create'}); }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-700">
          <Plus size={16} /> Tambah Slot
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Jam Mulai</th>
              <th className="p-4">Jam Selesai</th>
              <th className="p-4">Kuota Truk</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {slots.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono font-bold text-[#1B365D]">{formatT(s.jam_mulai)}</td>
                <td className="p-4 font-mono font-bold text-[#1B365D]">{formatT(s.jam_selesai)}</td>
                <td className="p-4 font-bold">{s.kuota_maksimal}</td>
                <td className="p-4 text-right">
                  <button onClick={() => { setFormData({ jam_mulai: formatT(s.jam_mulai), jam_selesai: formatT(s.jam_selesai), kuota_maksimal: s.kuota_maksimal}); setModal({ type: 'edit', slot: s}); }} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-sm p-4 space-y-4">
            <h3 className="font-bold text-lg">{modal.type === 'create' ? 'Tambah Slot' : 'Edit Slot'}</h3>
            <div><label className="text-sm font-semibold">Jam Mulai</label><input required type="time" value={formData.jam_mulai} onChange={e=>setFormData({...formData, jam_mulai: e.target.value})} className="w-full border p-2 rounded mt-1"/></div>
            <div><label className="text-sm font-semibold">Jam Selesai</label><input required type="time" value={formData.jam_selesai} onChange={e=>setFormData({...formData, jam_selesai: e.target.value})} className="w-full border p-2 rounded mt-1"/></div>
            <div><label className="text-sm font-semibold">Kuota Maksimal</label><input required type="number" min="1" value={formData.kuota_maksimal} onChange={e=>setFormData({...formData, kuota_maksimal: parseInt(e.target.value)})} className="w-full border p-2 rounded mt-1"/></div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setModal(null)} className="flex-1 border p-2 rounded font-medium hover:bg-gray-50">Batal</button>
              <button type="submit" className="flex-1 bg-[#1B365D] text-white p-2 rounded font-medium">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ==============================================
// TAB: AUDIT LOGS
// ==============================================
function TabAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs({ tanggal: filterDate || undefined });
      setLogs(data);
    } catch(e) { toast.error('Gagal memuat log'); }
    finally { setLoading(false); }
  }, [filterDate]);

  useEffect(() => { load(); }, [load]);

  const downloadCSV = () => {
    let csv = "ID,Waktu,Event,Plat Nomor,PO,Supplier,Pelapor (Role),Catatan\n";
    logs.forEach(l => {
      const d = new Date(l.timestamp_kejadian).toLocaleString('id-ID');
      const supp = l.booking.user.nama.replace(/,/g, '');
      const note = l.catatan ? l.catatan.replace(/,/g, '') : '';
      csv += `${l.id},"${d}",${l.event_type},${l.booking.plat_nomor_truk},${l.booking.nomor_po},${supp},"${l.reported_by.nama} (${l.reported_by.role})",${note}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `AuditLog_${new Date().getTime()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Audit Log</h2>
        <button onClick={downloadCSV} className="bg-[#1B365D] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#11233e]">
          Export to CSV
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} className="border p-2 rounded text-sm"/>
        <button onClick={load} className="border p-2 rounded bg-white hover:bg-gray-50 flex items-center gap-2 text-sm font-medium"><Filter size={16}/> Filter</button>
        <button onClick={()=>{setFilterDate(''); load();}} className="border p-2 rounded bg-white hover:bg-gray-50 text-sm font-medium">Reset</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Waktu</th>
              <th className="p-3">Event</th>
              <th className="p-3">Plat / PO</th>
              <th className="p-3">Pelapor</th>
              <th className="p-3">Catatan</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading...</td></tr> : 
             logs.length === 0 ? <tr><td colSpan={5} className="p-6 text-center text-gray-500">Tidak ada log</td></tr> :
             logs.map(l => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="p-3 text-xs">{new Date(l.timestamp_kejadian).toLocaleString('id-ID')}</td>
                <td className="p-3 font-bold text-[#1B365D]">{l.event_type}</td>
                <td className="p-3">
                  <div className="font-bold">{l.booking.plat_nomor_truk}</div>
                  <div className="text-xs text-gray-500">{l.booking.nomor_po}</div>
                </td>
                <td className="p-3">
                  <div>{l.reported_by.nama}</div>
                  <div className="text-xs text-gray-500 uppercase">{l.reported_by.role}</div>
                </td>
                <td className="p-3 text-xs text-gray-500 truncate max-w-xs">{l.catatan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==============================================
// TAB: SYSTEM HEALTH
// ==============================================
function TabHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchSystemHealth();
      setHealth(data);
    } catch(e) { toast.error('Gagal cek status'); }
  }, []);
  useEffect(() => { load(); const int = setInterval(load, 5000); return ()=>clearInterval(int); }, [load]);

  if (!health) return <div className="p-10 text-center text-gray-500 animate-pulse">Memeriksa Kesehatan Sistem...</div>;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Kesehatan Sistem (Live)</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className={`p-4 rounded-full ${health.database === 'Online' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
            <Activity size={32} />
          </div>
          <div>
            <p className="text-gray-500 font-medium">PostgreSQL Database</p>
            <p className={`text-2xl font-black ${health.database === 'Online' ? 'text-emerald-600' : 'text-red-600'}`}>{health.database}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className={`p-4 rounded-full ${health.redis === 'Online' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
            <Package size={32} />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Redis In-Memory</p>
            <p className={`text-2xl font-black ${health.redis === 'Online' ? 'text-emerald-600' : 'text-red-600'}`}>{health.redis}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 rounded-full bg-blue-100 text-blue-600">
            <Users size={32} />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Socket.io Connections</p>
            <p className="text-2xl font-black text-blue-600">{health.socket_connections} Aktif</p>
          </div>
        </div>

      </div>
      <p className="text-sm text-gray-400 mt-4 text-right">Update terakhir: {new Date(health.timestamp).toLocaleTimeString()}</p>
    </div>
  );
}
