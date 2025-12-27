const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    const email = 'test@gmail.com';
    const username = 'testgmail';
    const password = 'test123';
    
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existing) {
      console.log('⚠️  User already exists:', email);
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
      }
    });
    
    console.log('✅ Test user created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log(`   User ID: ${user.id}`);
    
  } catch (err) {
    console.error('❌ Error:', err.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
