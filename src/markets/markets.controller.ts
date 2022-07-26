import { Controller, Get, Query, } from '@nestjs/common';
import {
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MarketsService } from './markets.service';
import { ExchangeMarkets } from './entities/exchange.markets.entity';
import { Exchanges } from './enums/exchanges.enum';

/**
 * Provides market API routes.
 */
@ApiTags('markets')
@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  /**
   * Get supported markets for the requested exchange(s).
   * @param exchanges Exchange(s) to return markets of.
   * @returns Exchange markets for the requested exchange(s).
   */
  @Get('exchange-markets')
  @ApiQuery({
    name: 'exchanges',
    description: "Exchange(s) to return information from.",
    enum: Exchanges,
    isArray: true,
    required: false
  })
  @ApiResponse({
    status: 200,
    description: 'ExchangeMarket(s) with supported markets per exchange.',
    type: [ExchangeMarkets],
  })
  async getExchangeMarkets(@Query('exchanges') exchanges): Promise<ExchangeMarkets[]> {
    return await this.marketsService.getExchangeMarket(exchanges);
  }
}
