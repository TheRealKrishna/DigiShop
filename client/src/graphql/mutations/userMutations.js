import { gql } from "@apollo/client";

const SIGN_UP = gql`
    mutation createAccount($name: String!, $email: String!, $password: String!, $cart: String) {
        createAccount(name: $name, email: $email, password: $password, cart: $cart) {
          id
          name
          email
          auth_token
          profile
          cart {
            cartItems {
              product_id
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
                product_id
                quantity
              }
              total
            }
          }
    }
`;

const LOGIN_GOOGLE = gql`
    mutation loginGoogle($cart: String) {
        loginGoogle(cart: $cart) {
          id
          name
          email
          auth_token
          profile
          cart {
            cartItems {
              product_id
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

const UPDATE_CART = gql`
  mutation updateCart($productId: ID!, $quantity: Int!) {
    updateCart(product_id: $productId, quantity: $quantity) {
      success
      message
    }
  }
`

export { SIGN_UP, LOGIN, LOGIN_GOOGLE, FORGOT_PASSWORD, CHANGE_PASSWORD, UPDATE_CART }