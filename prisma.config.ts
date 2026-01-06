// Prisma config - uses DIRECT_URL for migrations (non-pooled connection)
import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Load .env.local for local development
config({ path: '.env.local' })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Use direct connection for migrations (required for schema changes)
    url: process.env['DIRECT_URL'] || process.env['DATABASE_URL'],
  },
})
