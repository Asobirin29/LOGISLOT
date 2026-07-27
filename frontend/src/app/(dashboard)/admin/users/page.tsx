'use client';

import { useState } from 'react';

export default function AdminUsersPage() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] overflow-hidden">
      {/* Top App Bar */}
      <header className="flex justify-between items-center px-lg py-lg w-full sticky top-0 z-30 bg-[#F4F6F9] border-b border-outline-variant">
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary">Manajemen User</h2>
        <div className="flex items-center gap-md">
          <button 
            onClick={() => setIsAddUserOpen(true)}
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
              <button className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md border border-primary transition-colors">Semua</button>
              <button className="px-4 py-1.5 rounded-full bg-transparent text-on-surface-variant font-label-md text-label-md border border-outline-variant hover:border-primary hover:text-primary transition-colors">Supplier</button>
              <button className="px-4 py-1.5 rounded-full bg-transparent text-on-surface-variant font-label-md text-label-md border border-outline-variant hover:border-primary hover:text-primary transition-colors">Inventory Control</button>
              <button className="px-4 py-1.5 rounded-full bg-transparent text-on-surface-variant font-label-md text-label-md border border-outline-variant hover:border-primary hover:text-primary transition-colors">Security</button>
              <button className="px-4 py-1.5 rounded-full bg-transparent text-on-surface-variant font-label-md text-label-md border border-outline-variant hover:border-primary hover:text-primary transition-colors">Warehouse</button>
              <button className="px-4 py-1.5 rounded-full bg-transparent text-on-surface-variant font-label-md text-label-md border border-outline-variant hover:border-primary hover:text-primary transition-colors">Admin</button>
            </div>
            
            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg font-body-md text-body-md bg-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-shadow" placeholder="Cari user..." type="text" />
            </div>
          </div>
          
          {/* User Data Table (Card style) */}
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
                  
                  {/* Row 1 */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">AW</div>
                      <span className="font-semibold text-on-surface">Ahmad Wijaya</span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">ahmad.w@ptsinar.com</td>
                    <td className="py-3 px-4 text-on-surface">PT Sinar Gemilang</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d6e3ff] text-[#001b3d]">Supplier</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                        <input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" type="checkbox"/>
                        <label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button className="text-outline hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                    </td>
                  </tr>
                  
                  {/* Row 2 */}
                  <tr className="bg-[#F8F9FF] hover:bg-surface-container-low transition-colors group">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">BS</div>
                      <span className="font-semibold text-on-surface">Budi Santoso</span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">budi.ic@logislot.com</td>
                    <td className="py-3 px-4 text-on-surface">Inventory Div</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f3e8ff] text-[#581c87]">Inventory Control</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                        <input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" type="checkbox"/>
                        <label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button className="text-outline hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                    </td>
                  </tr>
                  
                  {/* Row 3 */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">CH</div>
                      <span className="font-semibold text-on-surface">Citra Hapsari</span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">citra.sec@logislot.com</td>
                    <td className="py-3 px-4 text-on-surface">Security Pos 1</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ffedd5] text-[#9a3412]">Security</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                        <input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" type="checkbox"/>
                        <label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button className="text-outline hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                    </td>
                  </tr>
                  
                  {/* Row 4 */}
                  <tr className="bg-[#F8F9FF] hover:bg-surface-container-low transition-colors group">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">DP</div>
                      <span className="font-semibold text-on-surface">Dedi Pratama</span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">dedi.wh@logislot.com</td>
                    <td className="py-3 px-4 text-on-surface">Gudang Utama A</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ccfbf1] text-[#115e59]">Warehouse</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                        <input className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" type="checkbox"/>
                        <label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button className="text-outline hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                    </td>
                  </tr>
                  
                  {/* Row 5 */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">EK</div>
                      <span className="font-semibold text-on-surface">Eko Kurniawan</span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">admin@logislot.com</td>
                    <td className="py-3 px-4 text-on-surface">IT &amp; System</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1b365d] text-white">Admin</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                        <input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" type="checkbox"/>
                        <label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button className="text-outline hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                    </td>
                  </tr>
                  
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface">
              <span className="font-body-md text-on-surface-variant text-sm">Menampilkan 1-5 dari 124 user</span>
              <div className="flex gap-2">
                <button className="p-1 rounded border border-outline-variant text-outline hover:text-on-surface hover:bg-surface-container-low disabled:opacity-50"><span className="material-symbols-outlined">chevron_left</span></button>
                <button className="p-1 rounded border border-outline-variant text-outline hover:text-on-surface hover:bg-surface-container-low"><span className="material-symbols-outlined">chevron_right</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay & Slide-in Panel for "Tambah User Baru" */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsAddUserOpen(false)}></div>
          
          {/* Slide-in Panel */}
          <div className="relative w-full max-w-md bg-surface h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-outline-variant">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-lg border-b border-outline-variant bg-white">
              <h3 className="font-headline-md text-headline-md font-bold text-primary">Tambah User Baru</h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-outline hover:text-on-surface rounded-full p-1 hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* Panel Form Content */}
            <div className="flex-1 overflow-y-auto p-lg space-y-lg bg-[#F8F9FF]">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface">Nama Lengkap <span className="text-error">*</span></label>
                <input className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md bg-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-shadow" placeholder="Masukkan nama lengkap" type="text" />
              </div>
              
              {/* Email */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface">Email Aktif <span className="text-error">*</span></label>
                <input className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md bg-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-shadow" placeholder="contoh@domain.com" type="email" />
              </div>
              
              {/* Nomor Telepon */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface">Nomor Telepon</label>
                <input className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md bg-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-shadow" placeholder="+62 8..." type="tel" />
              </div>
              
              {/* Role Dropdown */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface">Role Internal <span className="text-error">*</span></label>
                <div className="relative">
                  <select className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md bg-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary appearance-none transition-shadow text-on-surface" defaultValue="">
                    <option disabled value="">Pilih Role</option>
                    <option value="ic">Inventory Control</option>
                    <option value="security">Security</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="admin">Admin</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                </div>
                <p className="font-body-md text-xs text-on-surface-variant mt-1">Catatan: User Supplier dibuat otomatis saat pendaftaran Vendor.</p>
              </div>
              
              {/* Instansi/Divisi */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface">Instansi/Divisi Penempatan <span className="text-error">*</span></label>
                <div className="relative">
                  <select className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md bg-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary appearance-none transition-shadow text-on-surface" defaultValue="">
                    <option disabled value="">Pilih Divisi</option>
                    <option value="div_ic">Divisi Inventory Pusat</option>
                    <option value="pos_1">Pos Security Gerbang Utama</option>
                    <option value="wh_a">Gudang A - Bahan Baku</option>
                    <option value="wh_b">Gudang B - Barang Jadi</option>
                    <option value="it_sys">IT &amp; System Control</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                </div>
              </div>
              
              {/* Toggle Email Credentials */}
              <div className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-lg mt-6">
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Kirim Kredensial via Email</p>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1">Kirim password sementara ke email user.</p>
                </div>
                <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                  <input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" type="checkbox"/>
                  <label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
            </div>
            
            {/* Panel Footer Actions */}
            <div className="p-lg border-t border-outline-variant bg-white flex justify-end gap-md">
              <button onClick={() => setIsAddUserOpen(false)} className="px-6 py-2 rounded-lg border border-secondary text-secondary font-label-md text-label-md hover:bg-surface-container-low transition-colors">
                Batal
              </button>
              <button className="px-6 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm w-full flex-1 md:flex-none">
                Simpan User
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked {
            right: 0;
            border-color: #68D391;
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #68D391;
        }
        .toggle-checkbox {
            right: 0;
            z-index: 1;
            border-color: #e2e8f0;
            transition: all 0.3s;
        }
        .toggle-label {
            width: 2.5rem;
            height: 1.25rem;
            background-color: #e2e8f0;
            border-radius: 9999px;
            transition: all 0.3s;
        }
      `}} />
    </div>
  );
}
