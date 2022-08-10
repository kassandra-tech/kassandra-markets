import { Controller, Get, Query, } from '@nestjs/common';
import {
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Exchanges } from '../enums/exchanges.enum';
import { MarketsService } from './markets.service';
import { ExchangeMarkets } from './entities/exchange.markets.entity';
import { Market } from './entities/market.entity';

/**
 * Provides market API routes.
 */
@ApiTags('markets')
@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) { }

  /**
   * Get supported exchange markets for the requested exchange(s).
   * @param exchanges Exchange(s) to return markets of.
   * @returns Exchange markets for the requested exchange(s).
   */
  @Get('exchange-markets')
  @ApiQuery({
    name: 'exchanges',
    description: "Exchange(s) to return information from.",
    enum: Exchanges,
    isArray: true,
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'ExchangeMarket(s) with supported markets per exchange.',
    type: ExchangeMarkets,
    isArray: true
  })
  async getExchangeMarkets(@Query('exchanges') exchanges): Promise<ExchangeMarkets[]> {
    return await this.marketsService.getExchangeMarkets(exchanges);
  }

  /**
   * Get supported market records for the requested exchange(s).
   * @param exchanges Exchange(s) to return markets of.
   * @returns Market records for the requested exchange(s).
   */
  @Get('market-records')
  @ApiQuery({
    name: 'exchanges',
    description: "Exchange(s) to return information from.",
    enum: Exchanges,
    isArray: true,
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Market(s) with supported markets per exchange.',
    type: Market,
    isArray: true
  })
  async getExchangeRecord(@Query('exchanges') exchanges): Promise<Market[]> {
    return await this.marketsService.getMarketRecords(exchanges);
  }
}
