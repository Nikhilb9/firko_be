import { Injectable } from '@nestjs/common';
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
    const params: { input: string; key: string; components: string } = {
      input,
      key: this.configService.get('GOOGLE_API_KEY') ?? '',
      components: 'country:IN',
    };

    const response = await axios.get(this.getPlacesUrl, { params });

    return response.data;
  }

  async getPlaceCoordinates(placeId: string): Promise<IGetPlaceCoordinates> {
    const params = {
      placeid: placeId,
      key: this.configService.get<string>('GOOGLE_API_KEY') ?? '',
      fields: 'name,formatted_address,geometry',
    };

    const detailsResponse: AxiosResponse<IPlaceDetailsApiResponse> =
      await axios.get(this.placeDetailUrl, { params });

    const result: IPlaceDetailsResult = detailsResponse.data.result;

    return {
      name: result.name,
      address: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    };
  }
}
