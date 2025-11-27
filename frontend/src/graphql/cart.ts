import { gql } from '@apollo/client';

export const GET_CART = gql`
  query GetCart {
    cart {
      id
      user {
        id
        email
      }
    }
  }
`;

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems {
      edges {
        node {
          id
          quantity
          product {
            id
            name
            price
            amountInStock
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
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($input: CartItemInput!) {
    addToCart(input: $input) {
      cartItem {
        id
        quantity
        product {
          id
          name
          price
          amountInStock
        }
      }
      ok
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($id: Int!, $quantity: Int!) {
    updateCartItem(id: $id, quantity: $quantity) {
      cartItem {
        id
        quantity
        product {
          id
          name
          price
        }
      }
      ok
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($id: Int!) {
    removeCartItem(id: $id) {
      ok
    }
  }
`;

