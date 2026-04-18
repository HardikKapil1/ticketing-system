import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        console.log('Creating Redis client with URL:', process.env.REDIS_URL);
        return new Redis(process.env.REDIS_URL!, {
          tls: {},
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
