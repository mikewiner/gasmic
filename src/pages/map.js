import React from "react";
import styled from "@emotion/styled";

import Map from "../components/Map";

const MapTitle = styled.h1`
  text-align: center;
  /* color: orange; */
`;

const MapPage = () => (
  <div>
    <MapTitle>Wow nice map, much markers</MapTitle>
    <Map />
  </div>
);

export default MapPage;
