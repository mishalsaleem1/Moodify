const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
  
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to database!');
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Database query successful. User count: ${userCount}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Suggestions:');
      console.log('1. Check if your Neon database is paused (visit console.neon.tech)');
      console.log('2. Verify your internet connection');
      console.log('3. Check if the DATABASE_URL in .env is correct');
      console.log('4. Wait a few moments for the database to wake up and try again');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
