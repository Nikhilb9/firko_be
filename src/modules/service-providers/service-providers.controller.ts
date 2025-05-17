import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Put,
  Body,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { ServiceProductResponseDto } from './dto/get-service-product.dto';
import { IAuthData } from '../auth/interface/auth.interface';
import { UpdateServiceProductDto } from './dto/update-service-product.dto';
import { CreateServiceProductDto } from './dto/create-service-product.dto';
import { ServiceProvidersService } from './service-providers.service';
import {
  IServiceProductListResponse,
  IServiceProductResponse,
} from './interfaces/service-providers.interface';
import { ServiceProductListResponseDto } from './dto/get-service-product-list-response.dto';
import { ServiceProductListQueryDto } from './dto/list-query-service-product.dto';

@ApiExtraModels(ServiceProductResponseDto, ServiceProductListResponseDto)
@Controller('service-providers')
export class ServiceProvidersController {
  constructor(
    private readonly serviceProvidersService: ServiceProvidersService,
  ) {}
  @Get('/:id')
  @ApiOperation({ summary: 'Get service or product by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the service or product',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Service product details by ID',
    type: ApiResponseDto<ServiceProductResponseDto>,
  })
  async getProductOrService(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<ServiceProductResponseDto>> {
    const serviceOrProduct: IServiceProductResponse =
      await this.serviceProvidersService.getServiceOrProduct(id);

    return new ApiResponseDto(
      200,
      'SUCCESS',
      'Service or product details by ID',
      serviceOrProduct,
    );
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update service or product by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the service or product to update',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Service or product updated successfully',
    type: ApiResponseDto,
  })
  @ApiBody({ type: UpdateServiceProductDto })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  async updateProductOrService(
    @Param('id') id: string,
    @Body() updateServiceProductData: UpdateServiceProductDto,
    @Request() req: Request & { user: IAuthData },
  ): Promise<ApiResponseDto<null>> {
    await this.serviceProvidersService.updateServiceOrProduct(
      id,
      updateServiceProductData,
      req.user.id,
    );
    return new ApiResponseDto(
      200,
      'SUCCESS',
      'Service or product updated successfully',
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new service or product' })
  @ApiResponse({
    status: 201,
    description: 'Service or product created successfully',
    type: ApiResponseDto,
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  async createProductOrService(
    @Body() createServiceProductData: CreateServiceProductDto,
    @Request() req: Request & { user: IAuthData },
  ): Promise<ApiResponseDto<null>> {
    await this.serviceProvidersService.createServiceOrProduct(
      createServiceProductData,
      req.user.id,
    );
    return new ApiResponseDto(
      200,
      'SUCCESS',
      'Service or product created successfully',
    );
  }

  @Get()
  @ApiOperation({ description: 'Get user product and service list' })
  @ApiResponse({
    status: 201,
    description: 'Service or product list',
    type: ApiResponseDto<ServiceProductListResponseDto>,
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  async getUserProductAndService(
    @Request() req: Request & { user: IAuthData },
  ) {
    const serviceAndProductList: IServiceProductListResponse[] =
      await this.serviceProvidersService.getUserProductAndServiceList(
        req.user.id,
      );
    return new ApiResponseDto(
      200,
      'SUCCESS',
      'Service or product created successfully',
      serviceAndProductList,
    );
  }

  @Get('/list')
  @ApiOperation({ description: 'Get product and service list' })
  @ApiResponse({
    status: 201,
    description: 'Service or product list',
    type: ApiResponseDto<ServiceProductListResponseDto>,
  })
  async getProductAndServiceList(@Query() query: ServiceProductListQueryDto) {
    const productAndService: IServiceProductListResponse[] =
      await this.serviceProvidersService.getAllProductAndServiceList(query);

    return new ApiResponseDto(
      200,
      'SUCCESS',
      'Service or product created successfully',
      productAndService,
    );
  }
}
