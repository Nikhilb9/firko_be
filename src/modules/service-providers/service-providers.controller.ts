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
import { ServiceResponseDto } from './dto/get-service.dto';
import { IAuthData } from '../auth/interface/auth.interface';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceProvidersService } from './service-providers.service';
import {
  IServiceListResponse,
  IServiceResponse,
} from './interfaces/service-providers.interface';
import { ServiceListResponseDto } from './dto/get-service-list-response.dto';
import { ServiceListQueryDto } from './dto/list-query-service.dto';
import { ServiceCategoryDto } from './dto/get-service-category.dto';
import { ResponseMessage } from '../../common/utils/api-response-message.util';

@ApiExtraModels(ServiceResponseDto, ServiceListResponseDto)
@Controller('service-providers')
export class ServiceProvidersController {
  constructor(
    private readonly serviceProvidersService: ServiceProvidersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ description: 'Create service' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseMessage.created('Service'),
    type: ApiResponseDto,
  })
  async createService(
    @Body() createServiceDto: CreateServiceDto,
    @Request() req: Request & { user: IAuthData },
  ) {
    await this.serviceProvidersService.createService(
      createServiceDto,
      req.user.id,
    );

    return new ApiResponseDto(
      HttpStatus.CREATED,
      'SUCCESS',
      ResponseMessage.created('Service'),
      null,
    );
  }

  @Get('/all-list')
  @ApiOperation({ description: 'Get service list' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseMessage.fetchedSuccessfully('Service list'),
    type: ApiResponseDto<ServiceListResponseDto>,
  })
  @ApiQuery({ type: ServiceListQueryDto })
  async getServiceList(@Query() query: ServiceListQueryDto) {
    const service: IServiceListResponse[] =
      await this.serviceProvidersService.getAllServiceList(query);

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Service list'),
      service,
    );
  }

  @Get('/category')
  @ApiOperation({ summary: 'Service category list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully('Service category list'),
    type: ApiResponseDto<ServiceCategoryDto>,
  })
  getServiceCategory(): ApiResponseDto<ServiceCategoryDto[]> {
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Service category list'),
      this.serviceProvidersService.getServiceCategory(),
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the service',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully('Service detail'),
    type: ApiResponseDto<ServiceResponseDto>,
  })
  async getService(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<ServiceResponseDto>> {
    const service: IServiceResponse =
      await this.serviceProvidersService.getService(id);

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Service detail'),
      service,
    );
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Update service by ID',
    description:
      'Update service details. Can also reactivate deactivated or sold services by setting status to ACTIVE.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the service to update',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.updated('Service'),
    type: ApiResponseDto,
  })
  @ApiBody({ type: UpdateServiceDto })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  async updateService(
    @Param('id') id: string,
    @Body() updateServiceData: UpdateServiceDto,
    @Request() req: Request & { user: IAuthData },
  ): Promise<ApiResponseDto<null>> {
    await this.serviceProvidersService.updateService(
      id,
      updateServiceData,
      req.user.id,
    );

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.updated('Service'),
    );
  }

  @Get()
  @ApiOperation({ description: 'Get user service list' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseMessage.fetchedSuccessfully('Services'),
    type: ApiResponseDto<ServiceListResponseDto>,
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  async getUserService(@Request() req: Request & { user: IAuthData }) {
    const serviceList: IServiceListResponse[] =
      await this.serviceProvidersService.getUserServiceList(req.user.id);

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Services'),
      serviceList,
    );
  }
}
