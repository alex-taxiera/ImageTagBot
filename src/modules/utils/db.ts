import type { PrismaClient as ImportedPrismaClient } from '@prisma/client'
import { createRequire } from 'module'

const require = createRequire(import.meta.url ?? __filename)

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const { PrismaClient: RequiredPrismaClient } = require('@prisma/client')

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const _PrismaClient: typeof ImportedPrismaClient = RequiredPrismaClient

export class PrismaClient extends _PrismaClient {}

export const prisma = new PrismaClient()
