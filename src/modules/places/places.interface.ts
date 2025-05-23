export interface IGeometry {
  location: {
    lat: number;
    lng: number;
  };
}

export interface IPlaceDetailsResult {
  name: string;
  formatted_address: string;
  geometry: IGeometry;
}

export interface IPlaceDetailsApiResponse {
  result: IPlaceDetailsResult;
  status: string;
}

export interface IGetPlaceCoordinates {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}
