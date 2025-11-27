import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
  query GetOrders($first: Int, $after: String) {
    orders(first: $first, after: $after) {
      edges {
        node {
          id
          status
          createdAt
          user {
            id
            email
          }
          items {
            edges {
              node {
                id
                quantity
                product {
                  id
                  name
                  price
                  images {
                    edges {
                      node {
                        id
                        image
                      }
                    }
                  }
                }
              }
            }
          }
          payments {
            edges {
              node {
                id
                amount
                currency
                status
                createdAt
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($status: String!) {
    createOrder(status: $status) {
      order {
        id
        status
        createdAt
        user {
          id
          email
        }
        items {
          edges {
            node {
              id
              quantity
              product {
                id
                name
                price
              }
            }
          }
        }
      }
      ok
    }
  }
`;

