import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma'; // Assuming prisma client is exported here
import { AppError } from '../utils/appError';

const signToken = (id: string) => {
  // We explicitly cast the secret and options to satisfy TypeScript
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = (process.env.JWT_EXPIRES_IN || '1d') as any;

  return jwt.sign({ id }, secret, {
    expiresIn: expiresIn,
  });
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return next(new AppError('Email already exists', 400));

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    const token = signToken(newUser.id);

    res.status(201).json({
      status: 'success',
      token,
      data: { user: { id: newUser.id, email: newUser.email, name: newUser.name } },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return next(new AppError('Please provide email and password', 400));

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
      data: { user: { id: user.id, email: user.email, name: user.name } },
    });
  } catch (error) {
    next(error);
  }
};
export const changePassword = async (req: any, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(401).json({ message: "Current password incorrect" });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedNewPassword },
  });

  res.status(200).json({ message: "Password updated" });
};