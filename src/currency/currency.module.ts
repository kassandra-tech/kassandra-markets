import { Module } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';

@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService],
})

/**
 * Market routing and service details to request currency information.
 */
export class CurrencyModule { }
