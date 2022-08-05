import { Module } from '@nestjs/common';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';

@Module({
  controllers: [PriceController],
  providers: [PriceService],
})

/**
 * Market routing and service details to request price information.
 */
export class PriceModule { }
