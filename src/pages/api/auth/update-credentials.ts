// pages/api/auth/update-credentials.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

interface UpdateRequest {
  currentEmail: string;
  newEmail?: string;
  newPassword?: string;
}

interface UpdateResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} not allowed` 
    });
  }

  const { currentEmail, newEmail, newPassword } = req.body as UpdateRequest;

  if (!currentEmail) {
    return res.status(400).json({ 
      success: false, 
      message: 'Current email is required' 
    });
  }

  try {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { email: currentEmail }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Prepare update data
    const updateData: {
      email?: string;
      passwordHash?: string;
    } = {};

    if (newEmail) {
      updateData.email = newEmail;
    }

    if (newPassword) {
      updateData.passwordHash = await hash(newPassword, 12);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No fields to update' 
      });
    }

    // Perform update
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    return res.status(200).json({ 
      success: true,
      message: 'Credentials updated successfully',
      user: updatedUser
    });

  } catch (error: any) {
    console.error('Update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}