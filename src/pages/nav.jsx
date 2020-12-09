import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { graphql, Link } from "gatsby";
import { Layout, Listing, Wrapper, Title } from "../components";
import website from "../../config/website";

const _ = require("lodash");

const ListyList = styled.div`
  width: 40%;
  background-color: ${(props) => props.theme.colors.greyLight};
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  a, h2 {
    padding-left: 100px;
    color: ${(props) => props.theme.colors.primary};
  }
`;

const SplitList = styled.div`
  display: flex;
  justify-content: center;
`;

class Nav extends Component {
  render() {
    const nodes = this.props.data.allAtmsJson.nodes;
    console.log(nodes);

    return (
      <Layout>
        <SplitList>
          <ListyList>
            <h2>List from JSON</h2>
            {nodes.map((node) => {
              //console.log(node.id);
              return (
                <>
                  <Link to={`/atms/${_.kebabCase(node.name + node.id)}`}>
                    {node.name}
                  </Link>
                </>
              );
            })}
            <br />
            <Link to={"/"}>LINK LIKE ZELDA</Link>
          </ListyList>
          <ListyList>
            <h2>List from Api</h2>

            {nodes.map((node) => {
              //console.log(node.id);
              return (
                <>
                  <Link
                    to={`/atms-from-api/${_.kebabCase(node.name + node.id)}`}
                  >
                    {node.name}
                  </Link>
                </>
              );
            })}
            <br />
            <Link to={"/"}>LINK LIKE ZELDA</Link>
          </ListyList>
        </SplitList>
      </Layout>
    );
  }
}

export default Nav;

export const pageQuery = graphql`
  query atmsQuery {
    allAtmsJson {
      nodes {
        id
        name
      }
    }
  }
`;
