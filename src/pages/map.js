import React from "react";
import styled from "@emotion/styled";
import { Link } from "gatsby";
import website from "../../config/website";

import Map from "../components/Map";

const MapTitle = styled.h1`
  @media all and (max-width: 800px) {
    display: none;
  }
`;
const MapHeader = styled.div`
  text-align: center;
  a {
    color: orange;
    &:visited,
    &:hover {
      color: orange;
    }
  }
`;

const MapPage = (props) => (
  <div>
    <MapHeader>
      <MapTitle>Wow nice map, much markers</MapTitle>
      <Link to={`/`}>Go home</Link>
    </MapHeader>
    <Map />
  </div>
);

export default MapPage;
