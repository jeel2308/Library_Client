/**--external-- */
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _includes from 'lodash/includes';
import _map from 'lodash/map';
import { Checkbox } from '@chakra-ui/react';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _size from 'lodash/size';

/**--internal-- */
import { withQuery } from '#components';
import { deleteLink, updateLink } from '#modules/Module';
import { compose } from '#Utils';
import { getFolderDetailsQuery } from '#modules/Queries';

/**--relative-- */
import classes from './Links.module.scss';
import Link from './Link';
import { getLinkActions } from './LinkUtils';
import EditOrCreateLinkModal from '../EditOrCreateLinkModal';
import Actions from './Actions';
import FolderListModal from './FolderListModal';

const Links = (props) => {
  const { folderDetails, folderId, deleteLink, isCompleted, updateLink } =
    props;
  const { links } = folderDetails;

  const [showEditLinkModal, setShowEditLinkModal] = useState(false);

  const [selectedLinks, setSelectedLinks] = useState([]);

  const [linkId, setLinkId] = useState(null);

  const [showBulkSelection, setShowBulkSelection] = useState(false);

  const [showFolderList, setShowFolderList] = useState(false);

  useEffect(() => {
    disableBulkSelectionMode();
  }, [folderId]);

  const openEditLinkModal = useCallback(({ linkId }) => {
    setShowEditLinkModal(true);
    setLinkId(linkId);
  }, []);

  const closeEditLinkModal = useCallback(() => {
    setShowEditLinkModal(false);
    setLinkId(null);
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
    return _map(links, (link) => {
      const { id } = link;
      const isLinkSelected = _includes(selectedLinks, id);

      const onChange = (e) => {
        e.stopPropagation();
        updateSelectedLinks({ id });
      };

      return (
        <div className={classes.linkOption} key={id}>
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
      <div className={classes.listContainer}>
        {renderLinks()}
        {showEditLinkModal && (
          <EditOrCreateLinkModal
            linkId={linkId}
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
  );
};

const mapActionCreators = {
  deleteLink,
  updateLink,
};

export default compose(
  connect(null, mapActionCreators),
  withQuery(getFolderDetailsQuery, {
    name: 'getFolderDetailsQuery',
    displayName: 'getFolderDetailsQuery',
    fetchPolicy: 'cache-and-network',
    getVariables: ({ folderId, isCompleted }) => {
      return {
        input: { id: folderId, type: 'FOLDER' },
        linkFilterInput: { isCompleted },
      };
    },
    getSkipQueryState: ({ folderId }) => !folderId,
    mapQueryDataToProps: ({ getFolderDetailsQuery }) => {
      const { data, networkStatus } = getFolderDetailsQuery;
      const isData = !_isEmpty(data);
      const isLoading = _includes([1, 2], networkStatus);
      const folderDetails = _get(data, 'node', {});
      return { isData, isLoading, folderDetails };
    },
  })
)(Links);
