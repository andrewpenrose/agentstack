/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { z } from 'zod';

export type CallApi = <T>(
  method: 'GET' | 'POST',
  url: string,
  data: Record<string, unknown> | null,
  resultSchema: z.ZodSchema<T>,
) => Promise<T>;

export function createCallApi({
  baseUrl,
  fetch: fetchFn,
}: {
  baseUrl: string;
  fetch: typeof globalThis.fetch;
}): CallApi {
  return async function callApi(method, url, data, resultSchema) {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let requestUrl = `${baseUrl}${url}`;

    if (method === 'GET' && data) {
      const params = new URLSearchParams();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params.append(key, String(value));
        }
      });

      requestUrl = `${requestUrl}?${params.toString()}`;
    } else if (method === 'POST' && data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetchFn(requestUrl, options);

    if (!response.ok) {
      throw new Error(`Failed to call Agent Stackk API - ${url}`);
    }

    const json = await response.json();

    return resultSchema.parse(json);
  };
}
