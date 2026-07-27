import axiosInstance from './axios';

export interface AdminUser {
  id: number;
  nama: string;
  email: string;
  role: string;
  nama_instansi: string;
  is_active: boolean;
  created_at: string;
}

export interface AdminDock {
  id: number;
  nama_dock: string;
  deskripsi: string | null;
  kapasitas_maksimal: number;
  status: string;
  created_at: string;
}

export interface AdminTimeSlot {
  id: number;
  jam_mulai: string;
  jam_selesai: string;
  kuota_maksimal: number;
  created_at: string;
}

export interface AuditLog {
  id: number;
  booking_id: number;
  event_type: string;
  timestamp_kejadian: string;
  reported_by_user_id: number;
  catatan: string | null;
  booking: {
    nomor_po: string;
    plat_nomor_truk: string;
    jenis_armada: string;
    user: {
      nama: string;
      nama_instansi: string;
    }
  };
  reported_by: {
    nama: string;
    role: string;
  };
}

export interface SystemHealth {
  database: string;
  redis: string;
  socket_connections: number;
  timestamp: string;
}

// ----------------------------------------------------
// USERS
// ----------------------------------------------------
export const fetchUsers = async (role?: string): Promise<AdminUser[]> => {
  const res = await axiosInstance.get('/admin/users', { params: { role } });
  return res.data.data;
};

export const createUser = async (data: Partial<AdminUser>): Promise<AdminUser> => {
  const res = await axiosInstance.post('/admin/users', data);
  return res.data.data;
};

export const updateUser = async (id: number, data: Partial<AdminUser>): Promise<AdminUser> => {
  const res = await axiosInstance.put(`/admin/users/${id}`, data);
  return res.data.data;
};

export const toggleUserStatus = async (id: number): Promise<AdminUser> => {
  const res = await axiosInstance.patch(`/admin/users/${id}/toggle-status`);
  return res.data.data;
};

// ----------------------------------------------------
// LOADING DOCKS
// ----------------------------------------------------
export const fetchDocks = async (): Promise<AdminDock[]> => {
  const res = await axiosInstance.get('/admin/loading-docks');
  return res.data.data;
};

export const createDock = async (data: Partial<AdminDock>): Promise<AdminDock> => {
  const res = await axiosInstance.post('/admin/loading-docks', data);
  return res.data.data;
};

export const updateDock = async (id: number, data: Partial<AdminDock>): Promise<AdminDock> => {
  const res = await axiosInstance.put(`/admin/loading-docks/${id}`, data);
  return res.data.data;
};

export const toggleDockStatus = async (id: number): Promise<AdminDock> => {
  const res = await axiosInstance.patch(`/admin/loading-docks/${id}/toggle-status`);
  return res.data.data;
};

// ----------------------------------------------------
// TIME SLOTS
// ----------------------------------------------------
export const fetchTimeSlots = async (): Promise<AdminTimeSlot[]> => {
  const res = await axiosInstance.get('/admin/time-slots');
  return res.data.data;
};

export const createTimeSlot = async (data: Partial<AdminTimeSlot>): Promise<AdminTimeSlot> => {
  const res = await axiosInstance.post('/admin/time-slots', data);
  return res.data.data;
};

export const updateTimeSlot = async (id: number, data: Partial<AdminTimeSlot>): Promise<AdminTimeSlot> => {
  const res = await axiosInstance.put(`/admin/time-slots/${id}`, data);
  return res.data.data;
};

// ----------------------------------------------------
// AUDIT LOGS
// ----------------------------------------------------
export const fetchAuditLogs = async (filters?: { tanggal?: string, user_id?: number, event_type?: string }): Promise<AuditLog[]> => {
  const res = await axiosInstance.get('/admin/audit-logs', { params: filters });
  return res.data.data;
};

// ----------------------------------------------------
// SYSTEM HEALTH
// ----------------------------------------------------
export const fetchSystemHealth = async (): Promise<SystemHealth> => {
  const res = await axiosInstance.get('/admin/system-health');
  return res.data.data;
};
