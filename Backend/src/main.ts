import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with dynamic origin handler for better compatibility
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://moodify-pnxy.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
      ];
      
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) {
        console.log('✅ Allowing request with no origin');
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        console.log(`✅ Allowing request from: ${origin}`);
        callback(null, true);
      } else {
        console.log(`❌ Blocking request from: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept',
      'X-Requested-With',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set global API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  
  try {
    await app.listen(port);
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`🔒 CORS enabled for: https://moodify-pnxy.vercel.app`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    throw error;
  }
}
bootstrap().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});