/* global Props,position,google,maps */
/* eslint-disable */
import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { MAP_KEY } from '../../config';
import { IReducer } from '../../stores'; // eslint-disable-line no-unused-vars
import { IMasjid, INewMasjid } from '../../stores/masjid/Reducer'; // eslint-disable-line no-unused-vars
import { setNewMasjidPositionAction } from './../../stores/masjid/Actions';

const center = {
  lat: 3.069776,
  lng: 101.503146,
};

interface Props {
  setNewMasjidPositionAction: (position: {
    latitude: INewMasjid['latitude'];
    longitude: INewMasjid['longitude'];
  }) => void;
}

const MapComponent: React.FC<Props> = ({ setNewMasjidPositionAction }) => {
  const currentPosition = useSelector((state: IReducer) => state.userReducer.position);
  const { newMasjid, showAddForm, masjids } = useSelector((state: IReducer) => {
    return {
      newMasjid: state.masjidReducer.new,
      showAddForm: state.masjidReducer.showAddForm,
      masjids: state.masjidReducer.masjids,
    };
  });

  const [selectedMasjid, setSelectedMasjid] = useState<IMasjid>();

  // @react-google-maps/api states
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: MAP_KEY,
  });

  const [zoom] = useState(14);

  const mapRef = React.useRef<google.maps.Map<Element>>();

  const onMapLoad = React.useCallback((map: google.maps.Map<Element>) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback((data: { lat: number; lng: number }) => {
    if (mapRef && mapRef.current) {
      mapRef.current.panTo(data);
      mapRef.current.setZoom(14);
    }
  }, []);

  const handleOnClick = React.useCallback(
    (e: google.maps.MouseEvent) => {
      showAddForm && setNewMasjidPositionAction({ latitude: e.latLng.lat(), longitude: e.latLng.lng() });
    },
    [setNewMasjidPositionAction, showAddForm],
  );

  useEffect(() => {
    if (currentPosition) {
      panTo({ lat: currentPosition.latitude, lng: currentPosition.longitude });
    }
  }, [panTo, currentPosition]);

  if (loadError) return <p>{loadError}</p>;
  if (!isLoaded) return <p>Loading...</p>;

  return (
    <GoogleMap mapContainerClassName="h-full" zoom={zoom} center={center} onLoad={onMapLoad} onClick={handleOnClick}>
      {showAddForm && newMasjid.latitude > 0 && newMasjid.longitude > 0 && (
        <Marker
          key={Date.now()}
          position={{ lat: newMasjid.latitude, lng: newMasjid.longitude }}
          icon={{
            url: '/mark-location.svg',
            origin: new window.google.maps.Point(0, 0),
            scaledSize: new window.google.maps.Size(50, 50),
          }}
        />
      )}
      {currentPosition && currentPosition.show && (
        <Marker
          key={currentPosition.accuracy}
          position={{ lat: currentPosition.latitude, lng: currentPosition.longitude }}
          icon={{
            url: '/user-location.svg',
            origin: new window.google.maps.Point(0, 0),
            scaledSize: new window.google.maps.Size(50, 50),
          }}
        />
      )}
      {masjids.length > 0 &&
        masjids.map((masjid) => (
          <Marker
            key={masjid._id}
            position={{ lat: masjid.latitude, lng: masjid.longitude }}
            icon={{
              url: '/masjid.svg',
              origin: new window.google.maps.Point(0, 0),
              scaledSize: new window.google.maps.Size(50, 50),
            }}
            onClick={() => {
              setSelectedMasjid(undefined);
              setSelectedMasjid(masjid);
            }}
          />
        ))}
      {selectedMasjid && (
        <InfoWindow
          position={{ lat: selectedMasjid.latitude, lng: selectedMasjid.longitude }}
          onCloseClick={() => {
            setSelectedMasjid(undefined);
          }}
        >
          <div className="font-medium">
            <h2 className="text-center text-lg mb-2">
              <span role="img" aria-label="Emoji : Masjid">
                🕌
              </span>{' '}
              {selectedMasjid.name}
            </h2>
            <p className="mb-1">Address : {selectedMasjid.address}</p>
            <p className="mb-1">Phone : {selectedMasjid.contactNo}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};
const Map = connect(null, { setNewMasjidPositionAction })(MapComponent);

export default Map;
