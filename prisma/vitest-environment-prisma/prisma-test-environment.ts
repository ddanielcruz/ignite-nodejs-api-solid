import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

function generateDatabaseUrl(schema: string) {
  const DATABASE_URL = process.env.DATABASE_URL
  if (!DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    // Generate a unique schema identifier for this test context
    const schema = randomUUID()
    process.env.DATABASE_URL = generateDatabaseUrl(schema)

    // Run Prisma migrations to generate DB schema
    execSync('pnpm prisma migrate deploy')

    return {
      async teardown() {
        // Drop the schema after the tests have completed
        const prisma = new PrismaClient()
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
