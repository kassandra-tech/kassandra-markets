import { Module } from '@nestjs/common';
import { MarketsController as MarketsController } from './markets.controller';
import { MarketsService } from './markets.service';

@Module({
  controllers: [MarketsController],
  providers: [MarketsService],
})

/**
 * Market routing and service details to request market information.
 */
export class MarketsModule { }
