import { gql } from '@apollo/client';

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($input: PaymentInput!) {
    createPayment(input: $input) {
      payment {
        id
        amount
        currency
        status
        stripePaymentIntent
        createdAt
        user {
          id
          email
        }
        order {
          id
          status
        }
      }
      clientSecret
      ok
    }
  }
`;

export const GET_PAYMENTS = gql`
  query GetPayments($first: Int, $after: String) {
    allPayments(first: $first, after: $after) {
      edges {
        node {
          id
          amount
          currency
          status
          stripePaymentIntent
          createdAt
          user {
            id
            email
          }
          order {
            id
            status
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

