import { Module } from '@nestjs/common';
import { MarketsModule } from './markets/markets.module';

@Module({
  imports: [MarketsModule],
})

/**
 * Provides access to API routes and services.
 */
export class AppModule {}
