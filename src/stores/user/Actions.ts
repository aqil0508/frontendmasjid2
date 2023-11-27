/* eslint-disable */
interface Position {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}
import { GET_CURRENT_LOCATION } from './Types';

type Dispatch = (arg: any) => void;

export const getLocationAction = () => async (dispatch: Dispatch): Promise<void> => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by this browser.');
    return;
  }

  try {
    const position = await new Promise<Position>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
    );

    dispatch({
      type: GET_CURRENT_LOCATION,
      payload: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        show: true,
      },
    });
  } catch (error) {
    const geoError = error as GeolocationPositionError;

    switch (geoError.code) {
      case geoError.PERMISSION_DENIED:
        alert('User denied the request for Geolocation.');
        break;
      case geoError.POSITION_UNAVAILABLE:
        alert('Location information is unavailable.');
        break;
      case geoError.TIMEOUT:
        alert('The request to get user location timed out.');
        break;
      default:
        alert(`A Geolocation error[${geoError.code}] occurred.`);
        break;
    }
  }
};