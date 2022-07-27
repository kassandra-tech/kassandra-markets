import { Controller, Get, Query, } from '@nestjs/common';
import {
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Exchanges } from 'src/enums/exchanges.enum';
import { MarketPrice } from './entities/market.price.entity';
import { MarketPrices } from './entities/market.prices.entity';
import { PriceService } from './price.service';

/**
 * Provides market API routes.
 */
@ApiTags('price')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  /**
   * Get supported markets for the requested exchange(s).
   * @param exchanges Exchange(s) to return markets of.
   * @returns Exchange markets for the requested exchange(s).
   */
  @Get('current-price')
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
    type: [MarketPrices],
  })
  async getExchangeMarkets(@Query('exchanges') exchanges): Promise<MarketPrices[]> {
    return await this.priceService.getCurrentMarketPrices(exchanges);
  }
}
