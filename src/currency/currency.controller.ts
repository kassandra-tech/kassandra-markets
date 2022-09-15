import { Controller, Get, Post, Query, } from '@nestjs/common';
import {
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Exchanges } from 'src/enums/exchanges.enum';
import { CurrencyService } from './currency.service';
import { Currencies } from './entity/currency.entity';

/**
 * Provides currency API routes.
 */
@ApiTags('currency')
@Controller('currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) {

    }

    /**
     * Get available currencies.
     * @param exchanges 
     * @returns 
     */
    @Get('/currencies')
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
        type: Currencies,
        isArray: true
    })
    async getAvailableCurrencies(@Query('exchanges') exchanges): Promise<Currencies[]> {
        return this.currencyService.getCurrencies(exchanges);
    }
}
