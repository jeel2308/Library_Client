/**--external-- */
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { onError } from '@apollo/client/link/error';
import _get from 'lodash/get';

/**--internal-- */
import { logoutUser } from '#modules/Module';

/**--relative-- */
import { getToken } from './Utils';
import schema from './fragmentTypes.json';
import { createCustomFetchFunction } from './apolloClientUtils';
import store from './store';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: schema,
});

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
  fetch: createCustomFetchFunction(),
});

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? token : '',
    },
  };
});

const errorLink = onError(({ networkError }) => {
  if (_get(networkError, ['result', 'message']) === 'jwt expired') {
    store.dispatch(logoutUser());
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache({
    fragmentMatcher,
    typePolicies: {
      Folder: {
        fields: {
          links: {
            merge: (_, incoming) => {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    },
  },
  /**
   * Apollo links will be recalculated for each operation.
   */

  link: from([errorLink, authLink, httpLink]),
});

export default client;
