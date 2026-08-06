import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import redisClient from '../utils/redis';
import { prisma } from '../prisma';
import { Role } from '@prisma/client';


export const register = async (req: Request, res: Response) => {
  try {
    const { nama, email, password, nama_instansi } = req.body;

    if (!nama || !email || !password || !nama_instansi) {
      return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Register is exclusively for supplier
    const newUser = await prisma.users.create({
      data: {
        nama,
        email,
        password_hash,
        nama_instansi,
        role: Role.supplier
      }
    });

    return res.status(201).json({
      status: 'success',
      message: 'Supplier registered successfully',
      data: {
        id: newUser.id,
        email: newUser.email,
      }
    });
  } catch (error: any) {
    console.error('[Register Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials or inactive account' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const accessToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({ id: user.id });

    // Store refresh token hash in Redis
    const rtHash = await bcrypt.hash(refreshToken, 10);
    try {
      if (redisClient.isOpen) {
        await redisClient.setEx(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, rtHash); // 7 days
      }
    } catch (e) {
      console.error('Redis error during login', e);
    }

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
    });

    return res.status(200).json({
      status: 'success',
      data: {
        token: accessToken, // Frontend saves this in memory
        user: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role,
          nama_instansi: user.nama_instansi
        }
      }
    });

  } catch (error: any) {
    console.error('[Login Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ status: 'error', message: 'No refresh token provided' });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (e) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired refresh token' });
    }

    // If Redis is available, verify the stored token hash (revocation check)
    // If Redis is not available, fall back to JWT-only verification (safe for dev)
    if (redisClient.isOpen) {
      const storedHash = await redisClient.get(`refresh_token:${payload.id}`);
      if (!storedHash) {
        return res.status(401).json({ status: 'error', message: 'Refresh token revoked or expired in store' });
      }
      const isValid = await bcrypt.compare(refreshToken, storedHash);
      if (!isValid) {
        return res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
      }
    }

    const user = await prisma.users.findUnique({ where: { id: payload.id } });
    if (!user || !user.is_active) {
      return res.status(401).json({ status: 'error', message: 'User not found or inactive' });
    }

    // Generate new access token
    const newAccessToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Optionally rotate refresh token as well, but standard is just new access token
    return res.status(200).json({
      status: 'success',
      data: {
        token: newAccessToken
      }
    });

  } catch (error: any) {
    console.error('[Refresh Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
       try {
         const payload = verifyRefreshToken(refreshToken);
         await redisClient.del(`refresh_token:${payload.id}`);
       } catch (e) {
         // Token might be expired, but we still clear the cookie
       }
    }
    
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('[Logout Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
