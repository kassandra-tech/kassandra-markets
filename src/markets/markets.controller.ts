import { Controller, Get, Query, } from '@nestjs/common';
import {
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Exchanges } from '../enums/exchanges.enum';
import { MarketsService } from './markets.service';
import { MarketsRecord } from './entities/markets.record.entity';
import { ExchangeMarkets } from './entities/exchange.markets.entity';
import { MarketsFilter } from 'src/enums/markets.filter.enum';

/**
 * Provides market API routes.
 */
@ApiTags('markets')
@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {

  }

  /**
   * Get supported markets for the requested exchange(s).
   * @param exchanges Exchange(s) to return markets of.
   * @param marketsFilter Get a subset of markets based on the filtered market provided.
   * @returns Markets for the requested exchange(s).
   */
  @Get()
  @ApiQuery({
    name: 'exchanges',
    description: "Exchange(s) to return information from.",
    enum: Exchanges,
    isArray: true,
    required: true
  })
  @ApiQuery({
    name: 'marketsFilter',
    description: "Exchange(s) to return information from.",
    enum: MarketsFilter,
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Market(s) with supported markets per exchange.',
    type: MarketsRecord,
    isArray: true
  })
  async getMarkets(@Query('exchanges') exchanges, @Query('marketsFilter') marketsFilter): Promise<MarketsRecord[]> {
    return await this.marketsService.getMarketRecords(exchanges, marketsFilter);
  }

  /**
   * Get supported market symbols for the requested exchange(s).
   * @param exchanges Exchange(s) to return information from.
   * @returns Market symbols for the requested exchange(s).
   */
  @Get('/symbols')
  @ApiQuery({
    name: 'exchanges',
    description: "Exchange(s) to return information from.",
    enum: Exchanges,
    isArray: true,
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Market symbols for the requested exchange(s).',
    type: String,
    isArray: true
  })
  async getMarketSymbols(@Query('exchanges') exchanges): Promise<string[]> {
    return this.marketsService.getMarketSymbols(exchanges);
  }
}
