// import { useNavigate, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]); // da 34an 4akl al map
  const [mapLat, mapLng] = useUrlPosition(); // Awl ma ykon feh query params fe al URL fo2 hib2o mugudin fi al 2 variables dol
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  // console.log("geolocationPosition: ", geolocationPosition);
  // console.log("mapPosition: ", mapPosition);
  // console.log(mapLat, mapLng);

  useEffect(
    function () {
      //bos al lat w al lng dol lma bno2f 3la al map bit7to fi al url fo2,
      // fa ana 3aiz a5znhom fi al location bta3 al map view , lih? 34an deh 2li al map btst5dmha 34an
      //t3rd al location, mn8ir da anta htro7 ll form bi location s7 bs 4akl al map hirga3
      // l 40 w 0 34an dol mt3dil4 3lihom lsa
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng],
  );

  useEffect(
    /* Dy ht4ta8l lma al user y3ml get current location, a a7na hngib al current location
    3n tri2 al getPosition, tb dy htsm3 fen? htsm3 fi al state 2li asmo geolocationPosition,
    fa a7na 3aizin da ysm3 fe al state bta3t al map, lih? 34an al map view tro7 ll
    current location bta3k
    */
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition],
  );

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? "Loading..." : "Use your position"}
      </Button>

      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
