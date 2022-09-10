/**--external-- */
import _isEmpty from 'lodash/isEmpty';
import _includes from 'lodash/includes';
import _get from 'lodash/get';
import _map from 'lodash/map';
import { graphql } from '@apollo/client/react/hoc';

/**--relative-- */
import { getUserFoldersQuery } from '#modules/Queries';
import { getUserFoldersFromCache } from '#modules/GraphqlHelpers';

export const getUserFoldersEnhancer = (customConfigurations) => {
  return graphql(getUserFoldersQuery, {
    name: 'getUserFoldersQuery',
    alias: 'getUserFoldersQuery',
    options: ({ userId }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: { input: { id: userId, type: 'USER' } },
      };
    },
    props: ({ getUserFoldersQuery, ownProps: { userId } }) => {
      const { networkStatus } = getUserFoldersQuery;
      const data = getUserFoldersFromCache({ showOptimistic: true, userId });
      const isData = !_isEmpty(data);
      const isLoading = _includes([1, 2], networkStatus);

      const { folders, name } = data;
      const folderList = _map(folders, ({ id, name }) => ({ id, label: name }));
      const userBasicDetails = { name };

      return {
        folders: folderList,
        isData,
        isLoading,
        userBasicDetails,
        ...(customConfigurations ? customConfigurations : {}),
      };
    },
  });
};
