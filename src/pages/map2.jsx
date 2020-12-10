import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { graphql } from 'gatsby'
import { Layout, Listing, Wrapper, Title } from '../components'
import website from '../../config/website'

const MapContainer = styled.div`
  background-color: ${(props) => props.theme.colors.greyLight};
  display: flex;
  justify-content: center;
  align-items: center;
  height:100vh;
`

class Map extends Component {
  render() {
    return (
      <Layout>
        <MapContainer>Your map goes here</MapContainer>
      </Layout>
    )
  }
}

export default Map