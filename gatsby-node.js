const _ = require('lodash')

// graphql function doesn't throw an error so we have to check to check for the result.errors to throw manually
const wrapper = (promise) =>
  promise.then((result) => {
    if (result.errors) {
      throw result.errors
    }
    return result
  })

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const postTemplate = require.resolve('./src/templates/post.jsx')
  const categoryTemplate = require.resolve('./src/templates/category.jsx')
  const atmsTemplate = require.resolve('./src/templates/atmsTemplate.jsx')
  const cityTemplate = require.resolve('./src/templates/cityTemplate.jsx')

  const result = await wrapper(
    graphql(`
      {
        allPrismicPost {
          edges {
            node {
              id
              uid
              data {
                categories {
                  category {
                    document {
                      data {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
        allAtmsJson {
          group(field: location___city) {
            edges {
              node {
                id
                name
                location {
                  city
                }
              }
            }
            totalCount
          }
          edges {
            node {
              id
              name
              prices {
                timestamp
                BTC_BuyPrice
                ETH_BuyPrice
                LTC_BuyPrice
                BTC_BuyFeeFlat
                BTC_BuyFee
                BTC_SellFeeFlat
                BTC_SellFee
                ETH_BuyFeeFlat
                ETH_BuyFee
                ETH_SellFeeFlat
                LTC_BuyFeeFlat
                LTC_BuyFee
                LTC_SellFeeFlat
                LTC_SellFee
                BTC_SellPrice
              }
            }
          }
        }
      }
    `)
  )

  const categorySet = new Set()
  const postsList = result.data.allPrismicPost.edges;
  const atmsList = result.data.allAtmsJson.edges;
  const citiesList = result.data.allAtmsJson.group;

  citiesList.forEach((group)=>{
    console.log(JSON.stringify(group.edges[0].node, null, 4));
    createPage({
      path: `/cities/${_.kebabCase(group.edges[0].node.location.city)}`,
      component: cityTemplate,
      context: {
        count:group.totalCount,
        name: group.edges[0].node.location.city,
      },
    })
  })

  atmsList.forEach((edge)=>{
    console.log(edge.node.name);
    createPage({
      path: `/atms/${_.kebabCase(edge.node.name+edge.node.id)}`,
      component: atmsTemplate,
      context: {
        name:edge.node.name,
        prices:edge.node.prices,
      },
    })
  })

  // Double check that the post has a category assigned
  postsList.forEach((edge) => {
    if (edge.node.data.categories[0].category) {
      edge.node.data.categories.forEach((cat) => {
        categorySet.add(cat.category.document[0].data.name)
      })
    }

    // The uid you assigned in Prismic is the slug!
    createPage({
      path: `/${edge.node.uid}`,
      component: postTemplate,
      context: {
        // Pass the unique ID (uid) through context so the template can filter by it
        uid: edge.node.uid,
      },
    })
  })

  const categoryList = Array.from(categorySet)

  categoryList.forEach((category) => {
    createPage({
      path: `/categories/${_.kebabCase(category)}`,
      component: categoryTemplate,
      context: {
        category,
      },
    })
  })
}
