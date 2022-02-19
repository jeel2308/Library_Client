import client from '../apolloClient';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import _includes from 'lodash/includes';
import _filter from 'lodash/filter';
import { getUserFoldersQuery } from './Queries';
import { folderFragments } from './Fragments';
export const getUserFoldersFromCache = ({
  showOptimistic = false,
  userId,
} = {}) => {
  try {
    const queryData = client.readQuery(
      {
        query: getUserFoldersQuery,
        variables: { input: { id: userId, type: 'USER' } },
      },
      showOptimistic
    );
    return _get(queryData, 'node', {});
  } catch (e) {
    console.error(e);
    return {};
  }
};

export const writeUserFoldersToCache = ({ data, userId }) => {
  try {
    client.writeQuery({
      query: getUserFoldersQuery,
      variables: { input: { id: userId, type: 'USER' } },
      data,
    });
  } catch (e) {
    console.error(e);
  }
};

export const updateUserFoldersInCache = ({
  addedFolders,
  userId,
  removedFolders,
}) => {
  const data = getUserFoldersFromCache({ userId });
  const { folders, ...rest } = data;

  let updatedFolders = folders;
  if (!_isEmpty(removedFolders)) {
    updatedFolders = _filter(
      folders,
      ({ id }) => !_includes(removedFolders, id)
    );
  }
  if (!_isEmpty(addedFolders)) {
    updatedFolders = [
      ...folders,
      ..._map(addedFolders, (folder) => ({ ...folder, __typename: 'Folder' })),
    ];
  }

  const newData = { ...rest, folders: updatedFolders };

  writeUserFoldersToCache({ data: { node: newData }, userId });
};

export const getFolderDetailsFromCache = ({ folderId }) => {
  let fragmentData;
  try {
    fragmentData = client.readFragment({
      id: `Folder:${folderId}`,
      fragment: folderFragments.folderBasicDetails,
      fragmentName: 'folderBasicDetailsItem',
    });
  } catch (e) {
    console.error(e);
  }

  return fragmentData;
};
