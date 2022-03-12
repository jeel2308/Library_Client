/**--external-- */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _includes from 'lodash/includes';
import _map from 'lodash/map';
import { Checkbox } from '@chakra-ui/react';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _size from 'lodash/size';
import _pipe from 'lodash/flow';
import _reverse from 'lodash/reverse';

/**--internal-- */
import { withQuery, withPagination } from '#components';
import { deleteLink, updateLink } from '#modules/Module';
import { compose, copyToClipboard, scrollToBottom } from '#Utils';
import { getFolderDetailsQuery } from '#modules/Queries';
import { getFolderDetailsFromCache } from '#modules/GraphqlHelpers';

/**--relative-- */
import classes from './Links.module.scss';
import Link from './Link';
import { getLinkActions } from './LinkUtils';
import EditOrCreateLinkModal from '../EditOrCreateLinkModal';
import Actions from './Actions';
import FolderListModal from './FolderListModal';
import { loaderStyle } from './LinksStyles';

const Links = (props) => {
  const {
    folderDetails,
    folderId,
    deleteLink,
    isCompleted,
    updateLink,
    onPageScroll,
    renderLoader,
    networkStatus,
  } = props;
  const { linksV2 } = folderDetails;

  const [showEditLinkModal, setShowEditLinkModal] = useState(false);

  const [selectedLinks, setSelectedLinks] = useState([]);

  const [showBulkSelection, setShowBulkSelection] = useState(false);

  const [showFolderList, setShowFolderList] = useState(false);

  const listScrollRef = useRef();

  const linksNodeRefs = useRef([]);

  const previousFolderId = useRef(folderId);

  const updateLinksNodeRefs = (node, index) => {
    linksNodeRefs.current[index] = node;
  };

  const links = _pipe((data) => {
    const edges = _get(data, 'edges', []);
    return _map(edges, ({ node }) => node);
  }, _reverse)(linksV2);

  const totalPresentLinks = _size(links);

  const previousTotalPresentLinksRef = useRef(_size(links));

  useEffect(() => {
    if (
      totalPresentLinks <= previousTotalPresentLinksRef.current ||
      previousFolderId.current !== folderId
    ) {
      return;
    }

    const addedLinksCount =
      totalPresentLinks - previousTotalPresentLinksRef.current;

    const totalVerticalDistance =
      linksNodeRefs.current?.[addedLinksCount]?.getBoundingClientRect().top ??
      0;

    listScrollRef.current.scrollTop = totalVerticalDistance - 75 - 75;
  }, [totalPresentLinks, folderId]);

  useEffect(() => {
    listScrollRef.current && scrollToBottom(listScrollRef.current);
  }, [folderId]);

  useEffect(() => {
    previousTotalPresentLinksRef.current = totalPresentLinks;
  }, [totalPresentLinks, networkStatus]);

  useEffect(() => {
    disableBulkSelectionMode();
  }, [folderId]);

  useEffect(() => {
    previousFolderId.current = folderId;
  }, [folderId]);

  const openEditLinkModal = useCallback(({ linkId }) => {
    setShowEditLinkModal(true);
    setSelectedLinks([linkId]);
  }, []);

  const closeEditLinkModal = useCallback(() => {
    setShowEditLinkModal(false);
    setSelectedLinks([]);
  }, []);

  const enableBulkSelectionMode = useCallback(({ linkId }) => {
    setShowBulkSelection(true);
    setSelectedLinks([linkId]);
  }, []);

  const disableBulkSelectionMode = useCallback(() => {
    setShowBulkSelection(false);
    setSelectedLinks([]);
  }, []);

  const closeFolderList = useCallback(() => {
    setShowFolderList(false);
    setSelectedLinks([]);
    disableBulkSelectionMode();
  }, []);

  const onUpdateFolder = ({ folderId }) => {
    updateLink({
      linksDetails: _map(selectedLinks, (id) => ({ id, folderId })),
    });
    closeFolderList();
  };

  const handleActions = ({ value, linkId }) => {
    switch (value) {
      case 'EDIT': {
        openEditLinkModal({ linkId });
        break;
      }
      case 'DELETE': {
        deleteLink({ linkIds: [linkId], isCompleted, folderId });
        break;
      }

      case 'MARK_AS_PENDING':
      case 'MARK_AS_COMPLETE': {
        updateLink({
          linksDetails: [{ id: linkId, isCompleted: !isCompleted }],
        });
        break;
      }
      case 'SELECT': {
        enableBulkSelectionMode({ linkId });
        break;
      }
      case 'MOVE': {
        setShowFolderList(true);
        setSelectedLinks([linkId]);
        break;
      }
      case 'COPY': {
        const { url } = _find(links, ({ id }) => id == linkId);
        copyToClipboard({ text: url });
      }
    }
  };

  const handleBulkSelectionActions = ({ type }) => {
    switch (type) {
      case 'DELETE': {
        deleteLink({ linkIds: selectedLinks, isCompleted, folderId });
        disableBulkSelectionMode();
        break;
      }
      case 'CANCEL': {
        disableBulkSelectionMode();
        break;
      }
      case 'UPDATE_STATUS': {
        updateLink({
          linksDetails: _map(selectedLinks, (id) => ({
            id,
            isCompleted: !isCompleted,
          })),
        });
        disableBulkSelectionMode();
        break;
      }
      case 'MOVE': {
        setShowFolderList(true);
      }
    }
  };

  const updateSelectedLinks = ({ id }) => {
    setSelectedLinks((selectedLinks) => {
      const filteredLinks = _filter(
        selectedLinks,
        (selectedLinkId) => selectedLinkId !== id
      );
      if (_size(filteredLinks) === _size(selectedLinks)) {
        return [...selectedLinks, id];
      }
      return filteredLinks;
    });
  };
  const renderLinks = () => {
    if (_isEmpty(links)) {
      return 'No links';
    }
    const linkActions = getLinkActions({ isCompleted });
    return _map(links, (link, index) => {
      const { id } = link;
      const isLinkSelected = _includes(selectedLinks, id);

      const onChange = (e) => {
        e.stopPropagation();
        updateSelectedLinks({ id });
      };

      return (
        <div
          className={classes.linkOption}
          key={id}
          ref={(node) => updateLinksNodeRefs(node, index)}
        >
          {showBulkSelection && (
            <Checkbox
              size="lg"
              isChecked={isLinkSelected}
              backgroundColor="white"
              borderColor="rgba(0,0,0,0.5)"
              onChange={onChange}
            />
          )}
          <div className={classes.linkContainer}>
            <Link
              {...link}
              dropDownOptions={linkActions}
              handleActions={handleActions}
            />
          </div>
        </div>
      );
    });
  };

  return (
    <div className={classes.container}>
      {showBulkSelection && (
        <Actions
          onCancelClick={() => handleBulkSelectionActions({ type: 'CANCEL' })}
          onDeleteClick={() => handleBulkSelectionActions({ type: 'DELETE' })}
          onMoveClick={() => handleBulkSelectionActions({ type: 'MOVE' })}
          onUpdateStatusClick={() =>
            handleBulkSelectionActions({ type: 'UPDATE_STATUS' })
          }
          statusButtonLabel={
            isCompleted ? 'Mark as pending' : 'Mark as completed'
          }
          totalSelectedLinks={_size(selectedLinks)}
        />
      )}
      {renderLoader && renderLoader()}
      <div
        className={classes.scrollContainer}
        ref={listScrollRef}
        onScroll={onPageScroll ? onPageScroll : () => {}}
      >
        <div className={classes.listContainer}>
          {renderLinks()}

          {showEditLinkModal && (
            <EditOrCreateLinkModal
              linkId={selectedLinks?.[0] ?? ''}
              closeModal={closeEditLinkModal}
              folderId={folderId}
            />
          )}
          {showFolderList && (
            <FolderListModal
              selectedLinks={selectedLinks}
              closeModal={closeFolderList}
              currentFolderId={folderId}
              onUpdateFolder={onUpdateFolder}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const mapActionCreators = {
  deleteLink,
  updateLink,
};

export default compose(
  connect(null, mapActionCreators),
  withQuery(getFolderDetailsQuery, {
    name: 'getFolderDetails',
    displayName: 'getFolderDetails',
    fetchPolicy: 'cache-and-network',
    getVariables: ({ folderId, isCompleted }) => {
      return {
        input: { id: folderId, type: 'FOLDER' },
        linkFilterInputV2: { isCompleted, first: 3 },
      };
    },
    getSkipQueryState: ({ folderId }) => !folderId,
    mapQueryDataToProps: ({
      getFolderDetails,
      ownProps: { folderId, isCompleted },
    }) => {
      const { networkStatus } = getFolderDetails;

      /**
       * Reading from cache is needed as sometimes getFolderDetails returns wrong cached data
       */
      const folderDetails = getFolderDetailsFromCache({
        folderId,
        linkFilters: { isCompleted, first: 3 },
      });

      const isData = !_isEmpty(folderDetails);
      const isLoading = _includes([1, 2], networkStatus);

      const pageInfo = _get(folderDetails, 'linksV2.pageInfo', {});
      const { endCursor, hasNextPage } = pageInfo;

      const fetchMore = async ({ first = 3 } = {}) => {
        return await getFolderDetails.fetchMore({
          //BUG: setting query option will not update network status while refetching
          variables: {
            input: {
              id: folderId,
              type: 'FOLDER',
            },
            linkFilterInputV2: { isCompleted, first, after: endCursor },
          },
          updateQuery: (previousFeed, { fetchMoreResult, ...rest }) => {
            const { node: oldNode } = previousFeed;
            const { node: newNode } = fetchMoreResult;

            const { linksV2: oldLinksV2 } = oldNode;
            const { linksV2: newLinksV2 } = newNode;

            const { edges: oldEdges } = oldLinksV2;
            const { edges: newEdges } = newLinksV2;

            const updatedEdges = [...oldEdges, ...newEdges];

            const { pageInfo: updatedPageInfo } = newLinksV2;

            return {
              ...previousFeed,
              node: {
                ...oldNode,
                linksV2: {
                  ...oldLinksV2,
                  edges: updatedEdges,
                  pageInfo: updatedPageInfo,
                },
              },
            };
          },
        });
      };

      return {
        isData,
        isLoading,
        folderDetails,
        networkStatus,
        hasNextPage,
        fetchMore,
      };
    },
  }),
  withPagination({ direction: 'TOP', loaderContainerStyle: loaderStyle })
)(Links);
