import client from '../apolloClient';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _size from 'lodash/size';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import _pipe from 'lodash/flow';

import {
  setUserInfoInStorage,
  getFieldPresenceStatus,
  clearStorage,
  getToken,
  getPostRequestPromise,
  getOrigin,
} from '../Utils';
import {
  updateUserFoldersInCache,
  addLinkInCache,
  deleteLinkFromCache,
  getUserFoldersFromCache,
} from './GraphqlHelpers';
import {
  addFolderMutation,
  updateFolderMutation,
  deleteFolderMutation,
  addLinkMutation,
  updateLinkMutation,
  deleteLinkMutation,
  updateUserMutation,
} from './Mutations';

/**--CONSTANTS AND UTILS-- */
export const DEFAULT_PAGE_SIZE = 9;

export const getTotalFolders = ({ userId }) => {
  const { folders } = getUserFoldersFromCache({ userId });

  return _size(folders);
};

/**--REDUX ACTIONS-- */
const SET_LOADER_VISIBILITY = 'SET_LOADER_VISIBILITY';

const UPDATE_USER_LOGGED_IN_STATUS = 'UPDATE_USER_LOGGED_IN_STATUS';

const SET_USER_DETAILS = 'SET_USER_DETAILS';

const SET_TOAST_MESSAGE = 'SET_TOAST_MESSAGE';

/**--REDUX ACTION GENERATORS-- */
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

/**--REDUX THUNKS-- */
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

      dispatch(
        setToastMessage({
          title: `Created collection successfully`,
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );
      dispatch(setLoaderVisibility(false));
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
      dispatch(setLoaderVisibility(false));
      throw e;
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

      dispatch(
        setToastMessage({
          title: `Updated collection successfully`,
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
      throw e;
    }
  };
};

export const deleteFolder = ({ id }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const userId = _get(state, 'userDetails.id', '');
    dispatch(setLoaderVisibility(true));
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

      dispatch(
        setToastMessage({
          title: `Deleted collection successfully`,
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );
      dispatch(setLoaderVisibility(false));
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
      dispatch(setLoaderVisibility(false));
      throw e;
    }
  };
};

export const addLinkBasicDetails = ({ url, folderId }) => {
  return async (dispatch) => {
    try {
      const mutationResponse = await client.mutate({
        mutation: addLinkMutation,
        variables: { input: { url, folderId } },
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
            linkFilters: {
              first: DEFAULT_PAGE_SIZE,
            },
            linkData: addLink,
          });
        },
      });

      dispatch(
        setToastMessage({
          title: 'Added resource successfully',
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );

      return _get(mutationResponse, 'data.linkManagement.addLink', {});
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
      throw e;
    }
  };
};

export const updateLinkBasicDetails = ({ linksDetails, oldFolderId }) => {
  return async (dispatch) => {
    const linksToBeRemovedFromCurrentFeed = _pipe(
      (data) => {
        return _filter(data, (link) => {
          const { folderId } = link;

          const isFolderPresent = getFieldPresenceStatus(folderId);

          return isFolderPresent;
        });
      },
      (data) => _map(data, ({ id }) => id)
    )(linksDetails);

    const areLinksMovedToAnotherFeed = !_isEmpty(
      linksToBeRemovedFromCurrentFeed
    );

    let mutationResponse = {};

    try {
      mutationResponse = await client.mutate({
        mutation: updateLinkMutation,
        variables: {
          input: linksDetails,
        },
        update: () => {
          if (areLinksMovedToAnotherFeed) {
            deleteLinkFromCache({
              folderId: oldFolderId,
              linkFilters: {
                first: DEFAULT_PAGE_SIZE,
              },
              linkIds: linksToBeRemovedFromCurrentFeed,
            });
          }
        },
      });

      const toastMessage = 'Links updated successfully';
      dispatch(
        setToastMessage({
          title: toastMessage,
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );

      return _get(mutationResponse, 'data.linkManagement.updateLink', []);
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
      throw e;
    }
  };
};

export const addLink = ({ url, folderId }) => {
  return async (dispatch) => {
    try {
      dispatch(setLoaderVisibility(true));
      const data = await dispatch(addLinkBasicDetails({ url, folderId }));
      dispatch(setLoaderVisibility(false));
      return data;
    } catch (e) {
      throw e;
    }
  };
};

export const updateLink = ({ linksDetails, oldFolderId }) => {
  return async (dispatch) => {
    try {
      dispatch(setLoaderVisibility(true));
      const data = await dispatch(
        updateLinkBasicDetails({
          linksDetails,
          oldFolderId,
        })
      );
      dispatch(setLoaderVisibility(false));
      return data;
    } catch (e) {
      throw e;
    }
  };
};

export const deleteLink = ({ folderId, linkIds }) => {
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
            linkFilters: { first: DEFAULT_PAGE_SIZE },
            linkIds,
          });
        },
      });
      dispatch(
        setToastMessage({
          title: `Deleted ${
            _size(linkIds) === 1 ? 'resource' : 'resource'
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
      throw e;
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

const _updateUserLoggedInStatus = ({ userInfo }) => {
  return (dispatch) => {
    setUserInfoInStorage({ userInfo });
    dispatch(setUserDetails(userInfo));
    dispatch(updateUserLoggedInStatus(true));
  };
};

export const loginUser = (data, successCallback) => {
  return async (dispatch, getState) => {
    let responseData = {};

    let res = {};
    try {
      dispatch(setLoaderVisibility(true));

      res = await getPostRequestPromise({ route: 'login', data });

      responseData = await res.json();

      const { message, showResetPasswordFlow, ...userInfo } = responseData;
      if (res.ok) {
        if (showResetPasswordFlow) {
          dispatch(setUserDetails(userInfo));
        } else {
          dispatch(_updateUserLoggedInStatus({ userInfo }));
        }
        successCallback && successCallback({ showResetPasswordFlow });
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

export const registerUser = (data) => {
  return async (dispatch) => {
    let res = {};

    try {
      dispatch(setLoaderVisibility(true));

      res = await getPostRequestPromise({ route: 'signup', data });

      const { message, ...userInfo } = await res.json();

      /**
       * If res status is ok(status is 200) then we will do redirection
       */
      if (res.ok) {
        dispatch(_updateUserLoggedInStatus({ userInfo }));
      } else {
        /**
         * Fetch api throws error only when network error occur.
         * For status 4xx and 5xx, we have to add logic for toast in try block
         */

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

export const resetPassword = (data, successCallback) => {
  return async (dispatch) => {
    let response = {};

    try {
      dispatch(setLoaderVisibility(true));

      response = await getPostRequestPromise({ route: 'reset-password', data });

      if (!response.ok) {
        const responseData = await response.json();

        dispatch(
          setToastMessage({
            title: responseData.message || response.statusText,
            status: 'error',
            isClosable: true,
            position: 'bottom-left',
          })
        );
      } else {
        successCallback && successCallback();
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

export const changePassword = (data, successCallback) => {
  return async (dispatch) => {
    try {
      dispatch(setLoaderVisibility(true));
      const response = await getPostRequestPromise({
        route: 'change-password',
        data,
      });

      const { message, ...userInfo } = await response.json();

      if (response.ok) {
        dispatch(_updateUserLoggedInStatus({ userInfo }));
        successCallback && successCallback();
      } else {
        dispatch(
          setToastMessage({
            title: message || response.statusText,
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

export const logoutUser = () => {
  return async (dispatch) => {
    try {
      const origin = getOrigin();
      dispatch(setLoaderVisibility(true));
      await fetch(`${origin}/logout`, {
        credentials: 'include',
        headers: {
          authorization: getToken(),
        },
        referrerPolicy: 'no-referrer',
      });
      clearStorage();
      window.location.href = '/';
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setLoaderVisibility(false));
    }
  };
};

export const refreshAccessToken = () => {
  return async (dispatch) => {
    try {
      const res = await getPostRequestPromise({ route: 'refresh-old-token' });
      const { message, ...userInfo } = await res.json();

      if (res.ok) {
        dispatch(_updateUserLoggedInStatus({ userInfo }));
      } else {
        dispatch(
          setToastMessage({
            title: message || res.statusText,
            status: 'error',
            isClosable: true,
            position: 'bottom-left',
          })
        );
        throw new Error(message || res.statusText);
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
      throw e;
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
