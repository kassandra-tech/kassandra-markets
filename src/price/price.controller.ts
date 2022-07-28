import { Controller, Get, Query, } from '@nestjs/common';
import {
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Exchanges } from 'src/enums/exchanges.enum';
import { CurrentPrices } from './entities/current.prices.entity';
import { Prices } from './entities/prices.entity';
import { PriceService } from './price.service';

/**
 * Provides market API routes.
 */
@ApiTags('price')
@Controller('price')
export class PriceController {
    constructor(private readonly priceService: PriceService) { }

    /**
     * Get current market prices for the requested exchange(s).
     * @param exchanges Exchange(s) to return markets of.
     * @returns Current market prices for the requested exchange(s).
     */
    @Get('current-price')
    @ApiQuery({
        name: 'exchanges',
        description: "Current market prices from the requested Exchange(s).",
        enum: Exchanges,
        isArray: true,
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'Current market prices from the requested Exchange(s).',
        type: CurrentPrices,
        isArray: true
    })
    async getCurrentMarketPrices(@Query('exchanges') exchanges): Promise<CurrentPrices[]> {
        return await this.priceService.getCurrentMarketPrices(exchanges);
    }

    /**
     * Get current market prices for the requested exchange(s).
     * @param exchanges Exchange(s) to return markets of.
     * @returns Current market prices for the requested exchange(s).
     */
    @Get('prices')
    @ApiQuery({
        name: 'exchanges',
        description: "Market prices from the requested Exchange(s).",
        enum: Exchanges,
        isArray: true,
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'Market prices from the requested Exchange(s).',
        type: CurrentPrices,
        isArray: true
    })
    async getMarketPrices(@Query('exchanges') exchanges): Promise<Prices[]> {
        return await this.priceService.getMarketPrices(exchanges);
    }
}
