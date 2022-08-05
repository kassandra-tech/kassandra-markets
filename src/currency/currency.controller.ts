import { Controller, Get, Post, Query, } from '@nestjs/common';
import {
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Exchanges } from 'src/enums/exchanges.enum';
import { CurrencyService } from './currency.service';
import { Currency } from './entity/currency.entity';

/**
 * Provides market API routes.
 */
@ApiTags('currency')
@Controller('currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) { }

    /**
     * Get current market prices for the requested exchange(s).
     * @param exchanges Exchange(s) to return markets of.
     * @returns Current market prices for the requested exchange(s).
     */
    @Get('currencies')
    @ApiQuery({
        name: 'exchanges',
        description: "Currencies from the requested Exchange(s).",
        enum: Exchanges,
        isArray: true,
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'Currencies from the requested Exchange(s).',
        type: Currency,
        isArray: true
    })
    async getCurrencies(@Query('exchanges') exchanges): Promise<Currency[]> {
        return await this.currencyService.getCurrencies(exchanges);
    }
}
