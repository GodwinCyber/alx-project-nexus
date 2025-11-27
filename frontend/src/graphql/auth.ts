import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      accessToken
      refreshToken
      user {
        id
        email
        username
      }
      ok
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      user {
        id
        email
        username
      }
      ok
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      email
      username
    }
  }
`;

