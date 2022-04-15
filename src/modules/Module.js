import client from '../apolloClient';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _size from 'lodash/size';
import _map from 'lodash/map';
import _find from 'lodash/find';
import _filter from 'lodash/filter';
import _pipe from 'lodash/flow';

import { setUserInfoInStorage, getFieldPresenceStatus } from '../Utils';
import {
  updateUserFoldersInCache,
  addLinkInCache,
  deleteLinkFromCache,
  getFolderDetailsFromCache,
} from './GraphqlHelpers';
import {
  addFolderMutation,
  updateFolderMutation,
  deleteFolderMutation,
  addLinkMutation,
  updateLinkMutation,
  deleteLinkMutation,
  updateLinksMetadataMutation,
  updateUserMutation,
} from './Mutations';

export const DEFAULT_PAGE_SIZE = 9;

export const addFolder =
  ({ name }) =>
  async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch(setLoaderVisibility(true));
      await client.mutate({
        mutation: addFolderMutation,
        variables: {
          input: { name },
        },
        update: (
          _,
          {
            data: {
              folderManagement: { addFolder },
            },
          }
        ) => {
          const { id, name } = addFolder;
          updateUserFoldersInCache({
            addedFolders: [{ id, name }],
            userId: _get(state, 'userDetails.id', ''),
          });
        },
      });
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } finally {
      dispatch(setLoaderVisibility(false));
    }
  };

export const updateFolder = ({ name, id }) => {
  return async (dispatch, getState) => {
    try {
      await client.mutate({
        mutation: updateFolderMutation,
        variables: { input: { id, name } },
        optimisticResponse: {
          folderManagement: {
            updateFolder: { id, name, __typename: 'Folder' },
            __typename: 'FolderMutations',
          },
        },
      });
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    }
  };
};

export const deleteFolder = ({ id }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const userId = _get(state, 'userDetails.id', '');
    try {
      await client.mutate({
        mutation: deleteFolderMutation,
        variables: { input: { id } },
        update: (_, { data }) => {
          const id = _get(data, 'folderManagement.deleteFolder.id', '');
          const removedFolders = [id];
          updateUserFoldersInCache({ removedFolders, userId });
        },
      });
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    }
  };
};

export const addLinkBasicDetails = ({ url, isCompleted, folderId }) => {
  return async (dispatch) => {
    try {
      await client.mutate({
        mutation: addLinkMutation,
        variables: { input: { url, folderId, isCompleted } },
        update: (
          _,
          {
            data: {
              linkManagement: { addLink },
            },
          }
        ) => {
          addLinkInCache({
            folderId,
            linkFilters: { isCompleted, first: DEFAULT_PAGE_SIZE },
            linkData: addLink,
          });
        },
      });

      dispatch(
        setToastMessage({
          title: 'Added link successfully',
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    }
  };
};

export const updateLinkBasicDetails = ({
  linksDetails,
  oldStatus,
  oldFolderId,
}) => {
  return async (dispatch) => {
    const linksToBeRemovedFromCurrentFeed = _pipe(
      (data) => {
        return _filter(data, (link) => {
          const { isCompleted, folderId } = link;
          const isStatusFilterPresent = getFieldPresenceStatus(isCompleted);

          const isFolderPresent = getFieldPresenceStatus(folderId);

          return isStatusFilterPresent || isFolderPresent;
        });
      },
      (data) => _map(data, ({ id }) => id)
    )(linksDetails);

    const areLinksMovedToAnotherFeed = !_isEmpty(
      linksToBeRemovedFromCurrentFeed
    );

    try {
      await client.mutate({
        mutation: updateLinkMutation,
        variables: {
          input: linksDetails,
        },
        update: () => {
          if (areLinksMovedToAnotherFeed) {
            deleteLinkFromCache({
              folderId: oldFolderId,
              linkFilters: { isCompleted: oldStatus, first: DEFAULT_PAGE_SIZE },
              linkIds: linksToBeRemovedFromCurrentFeed,
            });
          }
        },
      });

      const toastMessage = areLinksMovedToAnotherFeed
        ? _size(linksToBeRemovedFromCurrentFeed) > 1
          ? 'Links moved successfully'
          : 'Link moved successfully'
        : 'Links updated successfully';

      dispatch(
        setToastMessage({
          title: toastMessage,
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    }
  };
};

export const updateLinksMetadata = ({ linksDetails }) => {
  return async (dispatch) => {
    try {
      await client.mutate({
        mutation: updateLinksMetadataMutation,
        variables: { input: linksDetails },
      });
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    }
  };
};

export const addLink = ({ url, isCompleted, folderId }) => {
  return async (dispatch) => {
    dispatch(setLoaderVisibility(true));
    await dispatch(addLinkBasicDetails({ url, isCompleted, folderId }));
    dispatch(setLoaderVisibility(false));

    const folderDetails = getFolderDetailsFromCache({
      folderId,
      linkFilters: { isCompleted, first: DEFAULT_PAGE_SIZE },
    });

    const links = _pipe(
      (data) => _get(data, 'linksV2.edges', []),
      (data) => _map(data, ({ node }) => node)
    )(folderDetails);

    const { id } = _find(links, ({ url: linkUrl }) => url === linkUrl);
    dispatch(updateLinksMetadata({ linksDetails: [{ url, id }] }));
  };
};

export const updateLink = ({ linksDetails, oldStatus, oldFolderId }) => {
  return async (dispatch) => {
    const linksWithNewUrl = _filter(linksDetails, ({ url }) => !!url);

    dispatch(setLoaderVisibility(true));
    await dispatch(
      updateLinkBasicDetails({ linksDetails, oldStatus, oldFolderId })
    );
    dispatch(setLoaderVisibility(false));

    if (!_isEmpty(linksWithNewUrl)) {
      const updateLinksMetadataPayload = _map(
        linksWithNewUrl,
        ({ id, url }) => ({ id, url })
      );
      dispatch(
        updateLinksMetadata({ linksDetails: updateLinksMetadataPayload })
      );
    }
  };
};

export const deleteLink = ({ isCompleted, folderId, linkIds }) => {
  return async (dispatch, getState) => {
    const mutationInput = _map(linkIds, (id) => ({ id }));
    const responseLinks = _map(linkIds, (id) => ({ id, __typename: 'Link' }));

    try {
      await client.mutate({
        mutation: deleteLinkMutation,
        variables: { input: mutationInput },
        optimisticResponse: {
          linkManagement: {
            deleteLink: responseLinks,
            __typename: 'LinkMutations',
          },
        },
        update: () => {
          deleteLinkFromCache({
            folderId,
            linkFilters: { isCompleted, first: DEFAULT_PAGE_SIZE },
            linkIds,
          });
        },
      });
      dispatch(
        setToastMessage({
          title: `Deleted ${
            _size(linkIds) === 1 ? 'link' : 'links'
          } successfully`,
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    }
  };
};

export const updateUser = ({ input }) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setLoaderVisibility(true));
      const response = await client.mutate({
        mutation: updateUserMutation,
        variables: { input },
      });
      dispatch(
        setToastMessage({
          title: 'User details updated successfully',
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );

      const newUserDetails = _get(
        response,
        'data.userManagement.updateUser',
        {}
      );
      const userDetails = getState().userDetails;

      const updatedUserDetails = { ...userDetails, ...newUserDetails };

      dispatch(setUserDetails(updatedUserDetails));

      setUserInfoInStorage({ userInfo: updatedUserDetails });
    } catch (e) {
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
      throw e;
    } finally {
      dispatch(setLoaderVisibility(false));
    }
  };
};

const origin = process.env.REACT_APP_SERVER_URL;

const SET_LOADER_VISIBILITY = 'SET_LOADER_VISIBILITY';

const UPDATE_USER_LOGGED_IN_STATUS = 'UPDATE_USER_LOGGED_IN_STATUS';

const SET_USER_DETAILS = 'SET_USER_DETAILS';

const SET_TOAST_MESSAGE = 'SET_TOAST_MESSAGE';

export const setLoaderVisibility = (payload) => {
  return { type: SET_LOADER_VISIBILITY, payload };
};

export const updateUserLoggedInStatus = (payload) => {
  return { type: UPDATE_USER_LOGGED_IN_STATUS, payload };
};

export const setUserDetails = (payload) => {
  return { type: SET_USER_DETAILS, payload };
};

export const setToastMessage = (payload) => {
  return { type: SET_TOAST_MESSAGE, payload };
};

export const loginUser = (data) => {
  return async (dispatch, getState) => {
    let responseData = {};

    let res = {};
    try {
      dispatch(setLoaderVisibility(true));

      res = await fetch(`${origin}/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        referrerPolicy: 'no-referrer',
      });

      responseData = await res.json();

      const { message, ...userInfo } = responseData;
      if (res.ok) {
        setUserInfoInStorage({ userInfo });
        dispatch(setUserDetails(userInfo));

        /**
         * When we redirect using following approach, it will unmount App and
         * remount it. This is necessary because without it App won't be able to
         * use updated localStorage data.
         */
        window.location.href = '/';
      } else {
        dispatch(
          setToastMessage({
            title: message || res.statusText,
            status: 'error',
            isClosable: true,
            position: 'bottom-left',
          })
        );
      }
    } catch (e) {
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } finally {
      dispatch(setLoaderVisibility(false));
    }
  };
};

export const registerUser = (data, successCallback) => {
  return async (dispatch) => {
    let responseData = {};

    let res = {};

    try {
      dispatch(setLoaderVisibility(true));

      res = await fetch(`${origin}/signup`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        referrerPolicy: 'no-referrer',
      });

      /**
       * If res status is ok(status is 200) then we will do redirection
       */
      if (res.ok) {
        successCallback && successCallback();
      } else {
        /**
         * Fetch api throws error only when network error occur.
         * For status 4xx and 5xx, we have to add logic for toast in try block
         */
        responseData = await res.json();

        const { message } = responseData;

        /**
         * If there is message from backend then we will use it otherwise we use
         * default failure message from res obj.
         */
        dispatch(
          setToastMessage({
            title: message || res.statusText,
            status: 'error',
            isClosable: true,
            position: 'bottom-left',
          })
        );
      }
    } catch (e) {
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } finally {
      dispatch(setLoaderVisibility(false));
    }
  };
};

const reducerHandlers = {
  [SET_LOADER_VISIBILITY]: (state, action) => {
    const { payload } = action;
    return { ...state, showLoader: payload };
  },
  [UPDATE_USER_LOGGED_IN_STATUS]: (state, action) => {
    const { payload } = action;
    return { ...state, isUserLoggedIn: payload };
  },
  [SET_USER_DETAILS]: (state, action) => {
    const { payload } = action;
    return { ...state, userDetails: payload };
  },
  [SET_TOAST_MESSAGE]: (state, action) => {
    const { payload } = action;
    return { ...state, toastMessage: payload };
  },
};

const initialState = {
  showLoader: false,
  isUserLoggedIn: false,
  userDetails: {},
  toastMessage: {},
};

const reducer = (state, action) => {
  const type = action.type;
  const stateHandler = reducerHandlers[type];
  return stateHandler?.(state, action) ?? initialState;
};

export default reducer;
