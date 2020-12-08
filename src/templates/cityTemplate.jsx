import React from "react";
import PropTypes from "prop-types";
import { graphql, Link } from "gatsby";
import styled from "@emotion/styled";
import { Layout, Listing, Wrapper, Title, SEO, Header } from "../components";
import website from "../../config/website";

const Hero = styled.header`
  background-color: ${(props) => props.theme.colors.primary};
  padding-top: 1rem;
  padding-bottom: 4rem;
  h1 {
    color: ${(props) => props.theme.colors.bg};
  }
`;

const cityTemplate = (props) => {
  console.log(props);
  return (
    <Layout>
      <SEO title={``} pathname={``} />
      <Hero>
        <Wrapper>
          <h1>{props.pageContext.name}</h1>
          <div>
            <h2>prices</h2>
            <p>There are {props.pageContext.count} atms up in here</p>
          </div>
        </Wrapper>
      </Hero>
      <Wrapper>
        <Link style={{paddingTop:`30px`}}to={`/`}>Go Home</Link>
      </Wrapper>
    </Layout>
  );
};

export default cityTemplate;
