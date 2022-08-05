import { Module } from '@nestjs/common';
import { CurrencyModule } from './currency/currency.module';
import { MarketsModule } from './markets/markets.module';
import { PriceModule } from './price/price.module';

@Module({
  imports: [CurrencyModule, MarketsModule, PriceModule],
})

/**
 * Provides access to API routes and services.
 */
export class AppModule { }
