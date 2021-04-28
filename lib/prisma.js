import { PrismaClient } from '@prisma/client'

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
  console.log('[PRODUCTION] creating new PrismaClient')
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    console.log('[DEVELOPMENT] creating new PrismaClient')
  }
  prisma = global.prisma;
}

export default prisma;