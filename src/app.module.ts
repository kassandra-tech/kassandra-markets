import { Module } from '@nestjs/common';
import { MarketsModule } from './markets/markets.module';
import { PriceModule } from './price/price.module';

@Module({
  imports: [MarketsModule, PriceModule],
})

/**
 * Provides access to API routes and services.
 */
export class AppModule {}
