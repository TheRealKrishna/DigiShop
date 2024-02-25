import { gql } from "@apollo/client";

const SIGN_UP = gql`
mutation createAccount($name: String!, $email: String!, $password: String!) {
    createAccount(name: $name, email: $email, password: $password) {
        id
        name
        email
        auth_token
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
    }
}
`;

const FORGOT_PASSWORD = gql`
    mutation forgotPassword {
        forgotPassword(email: "agarwl.krishna2@gmail.com") {
        message
        success
        }
    }
  `

export { SIGN_UP, LOGIN, FORGOT_PASSWORD }