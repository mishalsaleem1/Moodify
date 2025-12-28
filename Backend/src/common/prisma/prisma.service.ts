import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // Optimized connection pool settings for Neon
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        await this.$connect();
        this.logger.log('✅ Successfully connected to database');
        break;
      } catch (error) {
        retries++;
        this.logger.warn(
          `⚠️ Database connection attempt ${retries}/${maxRetries} failed.`,
        );
        
        if (retries === maxRetries) {
          this.logger.error('❌ Failed to connect to database after maximum retries');
          throw error;
        }
        
        // Wait 1 second between retries
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🔌 Disconnected from database');
  }

  // Helper method to handle connection errors gracefully
  async executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        this.logger.warn(`Operation failed, retrying (${i + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('Max retries reached');
  }
}
