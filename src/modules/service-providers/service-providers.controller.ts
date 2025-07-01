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
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
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
import { ServiceProductCategoryDto } from './dto/get-service-product-category.dto';
import { ResponseMessage } from '../../common/utils/api-response-message.util';

@ApiExtraModels(ServiceProductResponseDto, ServiceProductListResponseDto)
@Controller('service-providers')
export class ServiceProvidersController {
  constructor(
    private readonly serviceProvidersService: ServiceProvidersService,
  ) {}
  @Get('/all-list')
  @ApiOperation({ description: 'Get product and service list' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseMessage.fetchedSuccessfully('Service or product list'),
    type: ApiResponseDto<ServiceProductListResponseDto>,
  })
  @ApiQuery({ type: ServiceProductListQueryDto })
  async getProductAndServiceList(@Query() query: ServiceProductListQueryDto) {
    const productAndService: IServiceProductListResponse[] =
      await this.serviceProvidersService.getAllProductAndServiceList(query);

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Service or product list'),
      productAndService,
    );
  }

  @Get('/category')
  @ApiOperation({ summary: 'Service or product category list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully(
      'Service or product category list',
    ),
    type: ApiResponseDto<ServiceProductCategoryDto>,
  })
  getServiceProductCategory(): ApiResponseDto<ServiceProductCategoryDto[]> {
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Service or product category list'),
      this.serviceProvidersService.getServiceProductCategory(),
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get service or product by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the service or product',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully(
      'Service or product detail',
    ),
    type: ApiResponseDto<ServiceProductResponseDto>,
  })
  async getProductOrService(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<ServiceProductResponseDto>> {
    const serviceOrProduct: IServiceProductResponse =
      await this.serviceProvidersService.getServiceOrProduct(id);

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Service or product detail'),
      serviceOrProduct,
    );
  }

  @Put('/:id')
  @ApiOperation({ 
    summary: 'Update service or product by ID',
    description: 'Update service or product details. Can also reactivate deactivated or sold services/products by setting status to ACTIVE.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the service or product to update',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.updated('Service or product'),
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
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.updated('Service or product'),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new service or product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseMessage.created('Service or product'),
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
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.created('Service or product'),
    );
  }

  @Get()
  @ApiOperation({ description: 'Get user product and service list' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseMessage.fetchedSuccessfully('Services or products'),
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
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Services or products'),
      serviceAndProductList,
    );
  }
}
