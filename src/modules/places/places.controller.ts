import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { IGetPlaceCoordinates } from './places.interface';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('autocomplete')
  @ApiOperation({ summary: 'Places list on search' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Places list',
    type: ApiResponseDto,
  })
  @ApiParam({
    name: 'input',
    description: 'Input for autocomplete',
    type: String,
    required: true,
  })
  async getAutocomplete(
    @Query('input') input: string,
  ): Promise<ApiResponseDto<any>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { predictions }: { predictions: []; status: string } =
      await this.placesService.autocomplete(input);

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      'Places list',
      predictions,
    );
  }

  @Get('coordinates')
  @ApiOperation({ summary: 'Places coordinates' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Place coordinates',
    type: ApiResponseDto<IGetPlaceCoordinates>,
  })
  @ApiQuery({
    name: 'placeId',
    description: 'placeId for place coordinates',
    type: String,
    required: true,
  })
  async getPlaceCoordinates(@Query('placeId') placeId: string) {
    const data: IGetPlaceCoordinates =
      await this.placesService.getPlaceCoordinates(placeId);

    return new ApiResponseDto(200, 'SUCCESS', 'Places coordinates', data);
  }
}
