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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const response = await axios.get(this.getPlacesUrl, { params });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return response.data;
  }

  async getPlaceCoordinates(placeId: string): Promise<IGetPlaceCoordinates> {
    const params = {
      placeid: placeId,
      key: this.configService.get<string>('GOOGLE_API_KEY') ?? '',
      fields: 'name,formatted_address,geometry',
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const detailsResponse: AxiosResponse<IPlaceDetailsApiResponse> =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await axios.get(this.placeDetailUrl, { params });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: IPlaceDetailsResult = detailsResponse.data.result;

    return {
      name: result.name,
      address: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    };
  }
}
