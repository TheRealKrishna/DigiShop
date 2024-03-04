import { gql } from "@apollo/client";

const GET_USER = gql`
  query GetUser {
    user {
      id
      name
      email
      auth_token
      profile
      cart {
        cartItems {
          id
          title
          description
          price
          discountedPrice
          thumbnail
          seller_id
          rating
          quantity
        }
        total
      }
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