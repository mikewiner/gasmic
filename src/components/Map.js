import React, { useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import L from "leaflet";
import {
  Map as BaseMap,
  TileLayer,
  ZoomControl,
  Marker,
  useMap,
} from "react-leaflet";
import mapStyles from "./Map.module.scss";
import { set } from "lodash";

const isDomAvailable = typeof window !== "undefined";

if (isDomAvailable) {
  // To get around an issue with the default icon not being set up right between using React
  // and importing the leaflet library, we need to reset the image imports
  // See https://github.com/PaulLeCam/react-leaflet/issues/453#issuecomment-410450387

  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });
}

const Map = ({ children }) => {
  
  // const { children } = props;
  const mapRef = useRef();
  useEffect(()=>{
    const { current = {} } = mapRef;
    const { leafletElement:map } = current;
    console.log(current);

    if( !map ) return;

    mapEffect(current);
  }, [mapRef])


  async function mapEffect({ leafletElement: map } = {}) {
    console.log(map);

    if ( !map ) return;

    map.eachLayer(( layer ) => {
      if ( layer?.options?.name === 'OpenStreetMap' ) return;
      map.removeLayer( layer );
    });

    console.log('map effect')
    let response;
    try {
      response = await axios.get(
        "https://public.localcoin.tech/service/api/v2/location"
      );
    } catch (e) {
      console.log(`Failed to fetch atms: ${e.message}`, e);
      return;
    }
    const { data = [] } = response;
    console.log(data);

    const hasData = Array.isArray(data) && data.length > 0;

    if (!hasData) return;

    const geoJson = {
      type: "FeatureCollection",
      features: data.map((atm) => {
        const { country } = atm.location;
        const { name } = atm;
        const { prices } = atm;
        let { latitude, longitude } = atm.location;

        console.log(name)

        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);

        return {
          type: "Feature",
          properties: {
            country: country,
            name,
            prices,
          },
          geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        };
      }),
    };
    console.log(geoJson);

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;

        const { country, name, prices } = properties;

        const html = `
          <span class="${mapStyles.iconMarker}">
            <span class="${mapStyles.iconMarkerTooltip}">
              <h2>${name}</h2>
              <ul>
                <li><strong>BTC:</strong> ${prices.BTC_BuyPrice}</li>
                <li><strong>LTC:</strong> ${prices.LTC_BuyPrice}</li>
                <li><strong>ETH:</strong> ${prices.ETH_BuyPrice}</li>
              </ul>
            </span>
          </span>
        `;

        return L.marker(latlng, {
          icon: L.divIcon({
            className: "icon",
            html,
          }),
          riseOnHover: true,
        });
      },
    });
    console.log('add to map')
    geoJsonLayers.addTo(map)
  }

  const mapSettings = {
    className: mapStyles.mapBase,
    zoomControl: false,
    center: [43.6532, -79.3832],
    zoom: 10,
    mapEffect
  };
  
  if (!isDomAvailable) {
    return (
      <div className={mapStyles.map}>
        <p className={mapStyles.mapLoading}>Loading map...</p>
      </div>
    );
  }

  return (
    <div className={mapStyles.map}>
      <BaseMap ref={mapRef} {...mapSettings}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />

        {children}
      </BaseMap>
    </div>
  );
};

Map.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  defaultBaseMap: PropTypes.string,
  mapEffect: PropTypes.func,
  ref: PropTypes.any,
};

export default Map;
