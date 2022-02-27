import client from '../apolloClient';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import _includes from 'lodash/includes';
import _filter from 'lodash/filter';
import { getFolderDetailsQuery, getUserFoldersQuery } from './Queries';
import { folderFragments, linkFragments } from './Fragments';
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
      updatedFolders,
      ({ id }) => !_includes(removedFolders, id)
    );
  }
  if (!_isEmpty(addedFolders)) {
    updatedFolders = [
      ...updatedFolders,
      ..._map(addedFolders, (folder) => ({ ...folder, __typename: 'Folder' })),
    ];
  }

  const newData = { ...rest, folders: updatedFolders };

  writeUserFoldersToCache({ data: { node: newData }, userId });
};

export const getFolderBasicDetailsFromCache = ({ folderId }) => {
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

export const getFolderDetailsFromCache = ({ folderId, linkFilters }) => {
  let queryData;

  try {
    queryData = client.readQuery({
      query: getFolderDetailsQuery,
      variables: {
        input: { id: folderId, type: 'FOLDER' },
        ...(linkFilters ? { linkFilterInput: linkFilters } : {}),
      },
    });
  } catch (e) {
    console.error(e);
  }
  return _get(queryData, 'node', {});
};

export const writeFolderDetailsToCache = ({ folderId, linkFilters, data }) => {
  try {
    client.writeQuery({
      query: getFolderDetailsQuery,
      variables: {
        input: { id: folderId, type: 'FOLDER' },
        ...(linkFilters ? { linkFilterInput: linkFilters } : {}),
      },
      data: { node: data },
    });
  } catch (e) {
    console.error(e);
  }
};

export const addLinkInCache = ({ folderId, linkFilters, linkData }) => {
  const oldFolderDetails = getFolderDetailsFromCache({
    folderId,
    linkFilters,
  });

  if (_isEmpty(oldFolderDetails)) {
    return;
  }

  const { links } = oldFolderDetails;
  const updatedLinks = [...links, linkData];
  const updatedFolderDetails = { ...oldFolderDetails, links: updatedLinks };
  writeFolderDetailsToCache({
    folderId,
    linkFilters,
    data: updatedFolderDetails,
  });
};

export const getLinkDetailsFromCache = ({ linkId }) => {
  let fragmentData = {};
  try {
    fragmentData = client.readFragment({
      id: `Link:${linkId}`,
      fragment: linkFragments.linkDetails,
      fragmentName: 'linkDetailsItem',
    });
  } catch (e) {
    console.error(e);
  }
  return fragmentData;
};

export const deleteLinkFromCache = ({ folderId, linkFilters, linkIds }) => {
  const oldFolderDetails = getFolderDetailsFromCache({
    folderId,
    linkFilters,
  });

  if (_isEmpty(oldFolderDetails)) {
    return;
  }

  const { links } = oldFolderDetails;
  const updatedLinks = _filter(links, ({ id }) => !_includes(linkIds, id));

  const updatedFolderDetails = { ...oldFolderDetails, links: updatedLinks };
  writeFolderDetailsToCache({
    folderId,
    linkFilters,
    data: updatedFolderDetails,
  });
};
