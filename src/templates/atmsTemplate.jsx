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

console.log();

const AtmTemplate = (props) => {
  console.log(props);
  
  return (
    <Layout>
      <SEO title={``} pathname={``} />
      <Hero>
        <Wrapper>
          <h1>{props.pageContext.name}</h1>
          <div>
            <h2>prices</h2>
            <p>btc:{props.pageContext.prices.BTC_BuyPrice}</p>
            <p>eth:{props.pageContext.prices.ETH_BuyPrice}</p>
            <p>ltc:{props.pageContext.prices.LTC_BuyPrice}</p>
          </div>
          <Link style={{color:'white'}} to={`/`}>Home</Link>{` `}
          <Link style={{color:'white'}} to={`/nav`}>Nav</Link>
        </Wrapper>
      </Hero>
    </Layout>
  );
};

export default AtmTemplate;
