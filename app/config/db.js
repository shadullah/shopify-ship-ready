// import { PrismaClient } from "@prisma/client";

// const prisma = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
// }

// export default prisma;

import { PrismaClient } from '@prisma/client'

// Add debug logging
console.log('Initializing Prisma Client...')
const prisma = new PrismaClient()

// Test connection immediately
async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Prisma connected successfully')
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Prisma connection failed:', error)
    process.exit(1)
  }
}
testConnection()

export default prisma;