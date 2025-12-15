/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CallApi } from '../call-api';
import { userSchema } from './types';

export function createUsersApi(callApi: CallApi) {
  const readUser = () => callApi('GET', '/api/v1/user', null, userSchema);

  return {
    readUser,
  };
}
