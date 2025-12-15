/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { createCallApi } from './call-api';
import type { ContextPermissionsGrant, GlobalPermissionsGrant, ModelCapability } from './types';
import { contextSchema, contextTokenSchema, listConnectorsResponseSchema, modelProviderMatchSchema } from './types';
import { createUsersApi } from './users/api';

export interface MatchProvidersParams {
  suggestedModels: string[] | null;
  capability: ModelCapability;
  scoreCutoff: number;
}

export interface CreateContextTokenParams {
  contextId: string;
  globalPermissions: GlobalPermissionsGrant;
  contextPermissions: ContextPermissionsGrant;
}

export const buildApiClient = (
  {
    baseUrl,
    fetch: fetchFn,
  }: {
    baseUrl: string;
    fetch?: typeof globalThis.fetch;
  } = { baseUrl: '' },
) => {
  const maybeFetch = fetchFn ?? (typeof globalThis.fetch !== 'undefined' ? globalThis.fetch : undefined);

  if (!maybeFetch) {
    throw new Error(
      'fetch is not available. In Node.js < 18 or environments without global fetch, provide a fetch implementation via the fetch option.',
    );
  }

  const callApi = createCallApi({ baseUrl, fetch: maybeFetch });

  const createContext = async (providerId: string) =>
    await callApi('POST', '/api/v1/contexts', { metadata: {}, provider_id: providerId }, contextSchema);

  const createContextToken = async ({ contextId, globalPermissions, contextPermissions }: CreateContextTokenParams) => {
    const token = await callApi(
      'POST',
      `/api/v1/contexts/${contextId}/token`,
      {
        grant_global_permissions: globalPermissions,
        grant_context_permissions: contextPermissions,
      },
      contextTokenSchema,
    );

    return { token, contextId };
  };

  const matchProviders = async ({ suggestedModels, capability, scoreCutoff }: MatchProvidersParams) => {
    return await callApi(
      'POST',
      '/api/v1/model_providers/match',
      {
        capability,
        score_cutoff: scoreCutoff,
        suggested_models: suggestedModels,
      },
      modelProviderMatchSchema,
    );
  };

  const listConnectors = async () => {
    return await callApi('GET', '/api/v1/connectors', null, listConnectorsResponseSchema);
  };

  const usersApi = createUsersApi(callApi);

  return {
    ...usersApi,
    createContextToken,
    createContext,
    matchProviders,
    listConnectors,
  };
};

export type AgentstackClient = ReturnType<typeof buildApiClient>;
