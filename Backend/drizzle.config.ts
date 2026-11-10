import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { getDBUrl } from './src/utils/dbUrl.js';

const connectionString = getDBUrl();

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
});
