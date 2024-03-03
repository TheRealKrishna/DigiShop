import { gql } from "@apollo/client";

const GET_PRODUCTS = gql`
  query GetUser {
    products {
        id
        title
        description
        price
        discountedPrice
        thumbnail
        seller_id
        rating
    }
  }
`;

const GET_PRODUCT = gql`
    query GetUser($id:ID!) {
        product(id: $id) {
          id
          title
          description
          price
          discountedPrice
          thumbnail
          seller_id
          rating
          reviews {
            id
            product_id
            reviewer_id
            reviewer_name
            rating
            title
            description
          }
        }
    }
`

export { GET_PRODUCTS, GET_PRODUCT }