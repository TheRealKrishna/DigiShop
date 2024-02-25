import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: process.env.REACT_APP_BACKEND_URI + "/graphql/",
    cache: new InMemoryCache(),
    headers: {
        "auth_token": localStorage.getItem('auth_token'),
    },
    defaultOptions: {
        query: {
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});

export default client;
