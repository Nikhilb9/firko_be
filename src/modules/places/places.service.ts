import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { GOOGLE_API_BASE_URL } from 'src/config/config';
import {
  IGetPlaceCoordinates,
  IPlaceDetailsApiResponse,
  IPlaceDetailsResult,
} from './places.interface';

@Injectable()
export class PlacesService {
  private readonly getPlacesUrl = `${GOOGLE_API_BASE_URL}/maps/api/place/autocomplete/json`;
  private readonly placeDetailUrl = `${GOOGLE_API_BASE_URL}/maps/api/place/details/json`;

  constructor(private readonly configService: ConfigService) {}

  async autocomplete(input: string): Promise<any> {
    try {
      if (!input) {
        throw new BadRequestException('Input cannot be empty');
      }
      const params: { input: string; key: string; components: string } = {
        input,
        key: this.configService.get('GOOGLE_API_KEY') ?? '',
        components: 'country:IN',
      };

      const response = await axios.get(this.getPlacesUrl, { params });

      if (!response.data) {
        throw new BadRequestException('Input search not found');
      }

      return response.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async getPlaceCoordinates(placeId: string): Promise<IGetPlaceCoordinates> {
    try {
      if (!placeId) {
        throw new BadRequestException('Place id cannot be empty');
      }
      const params = {
        placeid: placeId,
        key: this.configService.get<string>('GOOGLE_API_KEY') ?? '',
        fields: 'name,formatted_address,geometry',
      };

      const detailsResponse: AxiosResponse<IPlaceDetailsApiResponse> =
        await axios.get(this.placeDetailUrl, { params });

      const result: IPlaceDetailsResult = detailsResponse.data.result;

      if (!result) {
        throw new BadRequestException('Place not found');
      }

      return {
        name: result.name,
        address: result.formatted_address,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }
}
