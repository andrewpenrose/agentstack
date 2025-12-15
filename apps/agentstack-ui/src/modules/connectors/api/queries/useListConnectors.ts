/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useQuery } from '@tanstack/react-query';

import { agentStackClient } from '#api/agentstack-client.ts';

import { connectorKeys } from '../keys';

export function useListConnectors() {
  const query = useQuery({
    queryKey: connectorKeys.list(),
    queryFn: agentStackClient.listConnectors,
  });

  return query;
}
