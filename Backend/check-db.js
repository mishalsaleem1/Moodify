const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    const count = await prisma.song.count();
    console.log(`Song count: ${count}`);
  } catch (err) {
    console.error('❌ DB connection failed:', err.message || err);
    process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
}

main();
