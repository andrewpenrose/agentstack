/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

export enum UserRole {
  Admin = 'admin',
  Developer = 'developer',
  User = 'user',
}

export const userRoleSchema = z.enum(UserRole);

export const userSchema = z.object({
  id: z.string(),
  role: userRoleSchema,
  email: z.string(),
  created_at: z.string(),
});

export type User = z.infer<typeof userSchema>;
