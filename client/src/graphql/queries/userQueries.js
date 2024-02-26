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

const PASSWORD_RESET_TOKEN_VERIFY = gql`
    query resetPasswordTokenVerify {
        resetPasswordTokenVerify {
        message
        success
        }
    }
  `

export {GET_USER, PASSWORD_RESET_TOKEN_VERIFY}