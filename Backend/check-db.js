const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Check users
    const userCount = await prisma.user.count();
    console.log(`\n📊 Total users: ${userCount}`);
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
        }
      });
      console.log('\n👥 Users in database:');
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.username}) - Created: ${user.createdAt}`);
      });
    } else {
      console.log('⚠️  No users found in database');
    }
    
    // Check songs
    const songCount = await prisma.song.count();
    console.log(`\n🎵 Total songs: ${songCount}`);
    
  } catch (err) {
    console.error('❌ DB connection failed:', err.message || err);
    process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
}

main();
