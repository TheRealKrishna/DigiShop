import { gql } from "@apollo/client";

const GET_USER = gql`
  query GetUser {
    user {
      id
      name
      email
      auth_token
    }
  }
`;

export {GET_USER}