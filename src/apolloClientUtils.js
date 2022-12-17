import { refreshAccessToken } from './modules/Module';
import store from './store';
import { getToken } from './Utils';

/**
 * We are using HOF to keep track of refreshAccessTokenPromise and requestsWaitingForNewAccessToken
 * across multiple requests
 */
const createCustomFetchFunction = () => {
  let refreshAccessTokenPromise = null;
  let requestsWaitingForNewAccessToken = 0;

  /**
   * Return value of customFetchFunction should be promise.
   * So, when jwt is valid, we are creating another promise and returning response of promise returned by fetch.
   * Else, we are returning refreshAccessTokenPromise, which will make new request for original graphql reuest when resolved.
   */
  const customFetchFunction = (uri, options) => {
    return fetch(uri, options).then(async (res) => {
      //Cloning is needed when we need to read same body twice
      const clonedRes = res.clone();

      const { message } = await res.json();
      if (message === 'jwt expired') {
        if (requestsWaitingForNewAccessToken === 0) {
          refreshAccessTokenPromise = store.dispatch(refreshAccessToken());
        }
        requestsWaitingForNewAccessToken++;

        return refreshAccessTokenPromise
          .then(() => {
            requestsWaitingForNewAccessToken--;
            if (requestsWaitingForNewAccessToken === 0) {
              refreshAccessTokenPromise = null;
            }

            const { headers } = options;
            return fetch(uri, {
              ...options,
              headers: { ...headers, authorization: getToken() },
            });
          })
          .catch((e) => {
            console.error(e);

            requestsWaitingForNewAccessToken = 0;
            refreshAccessTokenPromise = null;

            return clonedRes;
          });
      }

      return clonedRes;
    });
  };

  return customFetchFunction;
};

export { createCustomFetchFunction };
