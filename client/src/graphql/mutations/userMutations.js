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

export { SIGN_UP, LOGIN, FORGOT_PASSWORD, CHANGE_PASSWORD }