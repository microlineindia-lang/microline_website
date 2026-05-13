// src/lib/datocms.ts
import { GraphQLClient } from 'graphql-request';

export const datoClient = new GraphQLClient(
  'https://graphql.datocms.com/',
  {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_DATO_API_TOKEN}`,
    },
  }
);