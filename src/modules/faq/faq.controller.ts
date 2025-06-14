import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FAQService } from './faq.service';
import { FAQ } from './schema/faq.schema';
import { FAQFilterDto } from './dto/faq.dto';
import { AuthGuard } from './../../common/guards/auth.guard';

@ApiTags('FAQ')
@Controller('faqs')
export class FAQController {
  constructor(private readonly faqService: FAQService) {}

  @Get()
  @ApiOperation({ summary: 'Get all FAQs with optional filtering' })
  async getAllFAQs(@Query() filter?: FAQFilterDto): Promise<FAQ[]> {
    return this.faqService.getAllFAQs(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get FAQ by ID' })
  async getFAQById(@Param('id') id: string): Promise<FAQ | null> {
    return this.faqService.getFAQById(id);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get FAQs by category' })
  async getFAQsByCategory(@Param('category') category: string): Promise<FAQ[]> {
    return this.faqService.getFAQsByCategory(category);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create a new FAQ' })
  async createFAQ(@Body() data: Partial<FAQ>): Promise<FAQ> {
    return this.faqService.createFAQ(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update an existing FAQ' })
  async updateFAQ(
    @Param('id') id: string,
    @Body() data: Partial<FAQ>,
  ): Promise<FAQ | null> {
    return this.faqService.updateFAQ(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Delete an FAQ' })
  async deleteFAQ(@Param('id') id: string): Promise<FAQ | null> {
    return this.faqService.deleteFAQ(id);
  }
}
