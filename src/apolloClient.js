/**--external-- */
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

/**--relative-- */
import { getToken } from './Utils';
import schema from './fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: schema,
});

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
  cache: new InMemoryCache({ fragmentMatcher }),
  headers: {
    authorization: getToken(),
  },
});

export default client;
