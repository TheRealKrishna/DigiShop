import { gql } from "@apollo/client";

const SIGN_UP = gql`
    mutation createAccount($name: String!, $email: String!, $password: String!) {
        createAccount(name: $name, email: $email, password: $password) {
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

const LOGIN = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
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

const LOGIN_GOOGLE = gql`
    mutation loginGoogle {
        loginGoogle {
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

const FORGOT_PASSWORD = gql`
    mutation forgotPassword($email: String!, $reCaptchaToken: String!) {
        forgotPassword(email: $email, reCaptchaToken: $reCaptchaToken) {
            message
            success
        }
    }
  `

const CHANGE_PASSWORD = gql`
    mutation changePassword($password:String!, $confirmPassword: String!) {
        changePassword(password: $password, confirmPassword: $confirmPassword) {
            message
            success
            }
        }
    `

export { SIGN_UP, LOGIN, LOGIN_GOOGLE, FORGOT_PASSWORD, CHANGE_PASSWORD }