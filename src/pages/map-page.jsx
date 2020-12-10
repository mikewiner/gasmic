import React, { useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import L from "leaflet";
import {
  Map as BaseMap,
  TileLayer,
  ZoomControl,
  Marker,
} from "react-leaflet";
import styled from "@emotion/styled";

const StyledMap = styled.div`
  .map {
    position: relative;
  }

  .map-base {
    width: 100vw;
    height: 100vh;
    background: #abd3df;
  }

  .map-loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    color: gray;
    width: 100%;
    height: 4em;
    line-height: 4em;
    text-align: center;
    margin: auto;
  }
`;

const MapPage = ({ children }) => {


  const mapRef = useRef();
  useEffect(()=>{
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;

    if( !map ) return;
    // console.log(mapRef);
    mapEffect(map);
  },[])

  async function mapEffect({ leafletElement: map } = {}) {
    console.log("map effect");
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

    const geoJson = {
      type: "FeatureCollection",
      features: data.map((atm) => {
        const { country = {} } = atm.location;
        let { latitude, longitude } = atm.location;

        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);

        return {
          type: "Feature",
          properties: {
            country: country,
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

        const { country } = properties;

        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li><strong>Confirmed:</strong> HI</li>
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
    console.log(geoJsonLayers)

    geoJsonLayers.addTo(map);
  }

  const mapSettings = {
    className: ``,
    zoomControl: false,
    center: [0, 0],
    zoom: 2,
    mapEffect,
  };

  return (
    <StyledMap className={``}>
      <BaseMap ref={mapRef} {...mapSettings}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />

        <Marker position={[0, 0]}> </Marker>
        {children}
      </BaseMap>
    </StyledMap>
  );
};

MapPage.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  defaultBaseMap: PropTypes.string,
  mapEffect: PropTypes.func,
  ref: PropTypes.any,
};

export default MapPage;
