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
    constructor(private readonly currencyService: CurrencyService) {

    }
}
