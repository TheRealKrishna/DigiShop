import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_BACKEND_URI}/graphql/`,
});

const authLink = setContext((_, { headers }) => ({
    headers: {
        ...headers,
        auth_token: localStorage.getItem('auth_token')
    }
}));

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: { errorPolicy: 'all' },
        mutate: { errorPolicy: 'all' }
    },
});

export default client;
