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
  Delete,
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
import { AuthGuard, OptionalAuthGuard } from '../../common/guards/auth.guard';
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
import { ProductOrServiceStatus } from './enums/service-providers.enum';

@ApiExtraModels(
  ServiceProductResponseDto,
  ServiceProductListResponseDto,
  ServiceProductCategoryDto,
)
@Controller('service-providers')
export class ServiceProvidersController {
  constructor(
    private readonly serviceProvidersService: ServiceProvidersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ description: 'Create service or product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseMessage.created('Service or product'),
    type: ApiResponseDto,
  })
  async createServiceOrProduct(
    @Body() createServiceProductDto: CreateServiceProductDto,
    @Request() req: Request & { user: IAuthData },
  ) {
    await this.serviceProvidersService.createServiceOrProduct(
      createServiceProductDto,
      req.user.id,
    );

    return new ApiResponseDto(
      HttpStatus.CREATED,
      'SUCCESS',
      ResponseMessage.created('Service or product'),
      null,
    );
  }

  @Get('/all-list')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ description: 'Get product and service list' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseMessage.fetchedSuccessfully('Service or product list'),
    type: ApiResponseDto<ServiceProductListResponseDto>,
  })
  @ApiQuery({ type: ServiceProductListQueryDto })
  async getProductAndServiceList(
    @Query() query: ServiceProductListQueryDto,
    @Request() req: Request & { user?: IAuthData },
  ) {
    const productAndService = await this.serviceProvidersService.getAllProductAndServiceList(
      query,
      req.user?.id,
    );

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Service or product list'),
      productAndService,
    );
  }

  @Get('/category')
  @ApiOperation({ description: 'Get service product category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully('Service product category'),
    type: ApiResponseDto<ServiceProductCategoryDto>,
  })
  async getServiceProductCategory() {
    const category = this.serviceProvidersService.getServiceProductCategory();

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Service product category'),
      category,
    );
  }

  @Get('/my-list')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ description: 'Get user service and product list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully('User service and product list'),
    type: ApiResponseDto<ServiceProductListResponseDto>,
  })
  async getUserProductAndServiceList(@Request() req: Request & { user: IAuthData }) {
    const productAndService = await this.serviceProvidersService.getUserProductAndServiceList(
      req.user.id,
    );

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('User service and product list'),
      productAndService,
    );
  }

  @Get('/:id')
  @ApiOperation({ description: 'Get service or product by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully('Service or product'),
    type: ApiResponseDto<ServiceProductResponseDto>,
  })
  async getServiceOrProduct(@Param('id') id: string) {
    const serviceOrProduct = await this.serviceProvidersService.getServiceOrProduct(id);

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Service or product'),
      serviceOrProduct,
    );
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ description: 'Update service or product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.updated('Service or product'),
    type: ApiResponseDto,
  })
  async updateServiceOrProduct(
    @Param('id') id: string,
    @Body() updateServiceProductDto: UpdateServiceProductDto,
    @Request() req: Request & { user: IAuthData },
  ) {
    await this.serviceProvidersService.updateServiceOrProduct(
      id,
      updateServiceProductDto,
      req.user.id,
    );

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.updated('Service or product'),
      null,
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ description: 'Delete service or product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.deleted('Service or product'),
    type: ApiResponseDto,
  })
  async deleteServiceOrProduct(
    @Param('id') id: string,
    @Request() req: Request & { user: IAuthData },
  ) {
    await this.serviceProvidersService.deleteServiceOrProduct(id, req.user.id);

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.deleted('Service or product'),
      null,
    );
  }
}
