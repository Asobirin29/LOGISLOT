import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { Role } from '@prisma/client';
import redisClient from '../utils/redis';
import { getIO, broadcastDockChanged } from '../utils/socket';



// ==========================================
// 1. USERS MANAGEMENT
// ==========================================

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    const where: any = {};
    if (role && typeof role === 'string') {
      where.role = role as Role;
    }

    const users = await prisma.users.findMany({
      where,
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        nama_instansi: true,
        is_active: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json({ status: 'success', data: users });
  } catch (error: any) {
    console.error('[Admin Get Users Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { nama, email, password, nama_instansi, role } = req.body;

    if (!nama || !email || !password || !role) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    if (!Object.values(Role).includes(role)) {
      return res.status(400).json({ status: 'error', message: 'Invalid role' });
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await prisma.users.create({
      data: {
        nama,
        email,
        password_hash,
        nama_instansi: role === 'supplier' ? nama_instansi : 'Internal',
        role: role as Role
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        nama_instansi: true,
        is_active: true
      }
    });

    return res.status(201).json({ status: 'success', data: newUser });
  } catch (error: any) {
    console.error('[Admin Create User Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nama, email, nama_instansi, role } = req.body;

    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // if email changed, check uniqueness
    if (email && email !== user.email) {
      const exist = await prisma.users.findUnique({ where: { email } });
      if (exist) return res.status(400).json({ status: 'error', message: 'Email already in use' });
    }

    const updated = await prisma.users.update({
      where: { id },
      data: {
        nama: nama ?? user.nama,
        email: email ?? user.email,
        nama_instansi: nama_instansi ?? user.nama_instansi,
        role: role ?? user.role
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        nama_instansi: true,
        is_active: true
      }
    });

    return res.status(200).json({ status: 'success', data: updated });
  } catch (error: any) {
    console.error('[Admin Update User Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.users.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const updated = await prisma.users.update({
      where: { id },
      data: { is_active: !user.is_active },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        is_active: true
      }
    });

    return res.status(200).json({ status: 'success', data: updated });
  } catch (error: any) {
    console.error('[Admin Toggle User Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// ==========================================
// 2. LOADING DOCKS MANAGEMENT
// ==========================================

export const getDocks = async (req: Request, res: Response) => {
  try {
    const docks = await prisma.loading_docks.findMany({
      orderBy: { id: 'asc' }
    });
    return res.status(200).json({ status: 'success', data: docks });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createDock = async (req: Request, res: Response) => {
  try {
    const { nama_dock, deskripsi, kapasitas_maksimal } = req.body;
    if (!nama_dock) return res.status(400).json({ status: 'error', message: 'Nama dock required' });

    const dock = await prisma.loading_docks.create({
      data: {
        nama_dock,
        deskripsi: deskripsi || null,
        kapasitas_maksimal: kapasitas_maksimal ? Number(kapasitas_maksimal) : 1
      }
    });
    return res.status(201).json({ status: 'success', data: dock });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateDock = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nama_dock, deskripsi, kapasitas_maksimal } = req.body;
    
    const dock = await prisma.loading_docks.update({
      where: { id },
      data: {
        ...(nama_dock && { nama_dock }),
        ...(deskripsi !== undefined && { deskripsi }),
        ...(kapasitas_maksimal && { kapasitas_maksimal: Number(kapasitas_maksimal) })
      }
    });
    return res.status(200).json({ status: 'success', data: dock });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const toggleDockStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const dock = await prisma.loading_docks.findUnique({ where: { id } });
    if (!dock) return res.status(404).json({ status: 'error', message: 'Dock not found' });

    const newStatus = dock.status === 'active' ? 'maintenance' : 'active';
    const updated = await prisma.loading_docks.update({
      where: { id },
      data: { status: newStatus }
    });

    broadcastDockChanged({ loading_dock_id: id, status: newStatus });

    return res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// ==========================================
// 3. TIME SLOTS MANAGEMENT
// ==========================================

export const getTimeSlots = async (req: Request, res: Response) => {
  try {
    const slots = await prisma.time_slots.findMany({
      orderBy: { jam_mulai: 'asc' }
    });
    // Format the time since prisma returns date objects for db.Time
    const formatted = slots.map(s => ({
      ...s,
      jam_mulai: s.jam_mulai.toISOString(),
      jam_selesai: s.jam_selesai.toISOString(),
    }));
    return res.status(200).json({ status: 'success', data: formatted });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createTimeSlot = async (req: Request, res: Response) => {
  try {
    const { jam_mulai, jam_selesai, kuota_maksimal } = req.body;
    if (!jam_mulai || !jam_selesai || !kuota_maksimal) {
      return res.status(400).json({ status: 'error', message: 'Missing fields' });
    }

    // jam_mulai and jam_selesai should be parsed into dummy dates since it's a TIME column
    const slot = await prisma.time_slots.create({
      data: {
        jam_mulai: new Date(`1970-01-01T${jam_mulai}Z`),
        jam_selesai: new Date(`1970-01-01T${jam_selesai}Z`),
        kuota_maksimal: Number(kuota_maksimal)
      }
    });
    return res.status(201).json({ status: 'success', data: slot });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateTimeSlot = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { jam_mulai, jam_selesai, kuota_maksimal } = req.body;
    
    const dataToUpdate: any = {};
    if (jam_mulai) dataToUpdate.jam_mulai = new Date(`1970-01-01T${jam_mulai}Z`);
    if (jam_selesai) dataToUpdate.jam_selesai = new Date(`1970-01-01T${jam_selesai}Z`);
    if (kuota_maksimal) dataToUpdate.kuota_maksimal = Number(kuota_maksimal);

    const slot = await prisma.time_slots.update({
      where: { id },
      data: dataToUpdate
    });
    return res.status(200).json({ status: 'success', data: slot });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// ==========================================
// 4. AUDIT LOGS
// ==========================================

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { tanggal, user_id, event_type } = req.query;

    const where: any = {};
    if (tanggal && typeof tanggal === 'string') {
      const d = new Date(tanggal);
      where.timestamp_kejadian = {
        gte: new Date(d.setHours(0,0,0,0)),
        lt: new Date(d.setHours(23,59,59,999))
      };
    }
    if (user_id) where.reported_by_user_id = Number(user_id);
    if (event_type) where.event_type = event_type as any;

    const logs = await prisma.tracking_logs.findMany({
      where,
      include: {
        booking: {
          select: {
            nomor_po: true,
            plat_nomor_truk: true,
            jenis_armada: true,
            user: { select: { nama: true, nama_instansi: true } }
          }
        },
        reported_by: {
          select: { nama: true, role: true }
        }
      },
      orderBy: { timestamp_kejadian: 'desc' },
      take: 500 // limit to 500 latest logs to avoid overload
    });

    return res.status(200).json({ status: 'success', data: logs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// ==========================================
// 5. SYSTEM HEALTH
// ==========================================

export const getSystemHealth = async (req: Request, res: Response) => {
  try {
    let dbStatus = 'Offline';
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'Online';
    } catch (e) {
      console.error('DB Health Error', e);
    }

    let redisStatus = 'Offline';
    if (redisClient.isReady) {
      redisStatus = 'Online';
    }

    let socketConnections = 0;
    const io = getIO();
    if (io && io.engine) {
      // NOTE: For multi-instance redis adapter, io.engine.clientsCount only gets LOCAL instance count.
      // But it's good enough for a basic health endpoint.
      socketConnections = io.engine.clientsCount;
    }

    return res.status(200).json({
      status: 'success',
      data: {
        database: dbStatus,
        redis: redisStatus,
        socket_connections: socketConnections,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
