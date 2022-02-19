/**--external-- */
import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _pipe from 'lodash/flow';
import _filter from 'lodash/filter';
import _includes from 'lodash/includes';

/**--internal-- */
import { compose, getMatchingResults } from '#Utils';
import { withQuery, Sidebar } from '#components';
import { getUserFoldersQuery } from '#modules/Queries';

/**--relative-- */
import classes from './Folders.module.scss';
import AddButton from './AddButton';
import Search from './Search';
import EditOrCreateFolderModal from './EditOrCreateFolderModal';
import DeleteWarningModal from './DeleteWarningModal';
import { loadingContainerStyle } from './FoldersStyles';

const Resources = (props) => {
  const { folders } = props;

  const [searchValue, setSearchValue] = useState('');

  const [showEditOrCreateFolderModal, setShowEditOrCreateFolderModal] =
    useState(false);

  const [showDeleteWarningModal, setShowDeleteWarningModal] = useState(false);

  const [folderId, setFolderId] = useState(null);

  const closeEditOrCreateFolderModal = useCallback(() => {
    setShowEditOrCreateFolderModal(false);
    setFolderId(null);
  }, []);

  const closeDeleteWarningModal = useCallback(() => {
    setShowDeleteWarningModal(false);
    setFolderId(null);
  }, []);

  const matchingFolders = getMatchingResults({
    list: folders,
    field: 'label',
    searchText: searchValue,
  });

  const handleAction = ({ data, type }) => {
    switch (type) {
      case 'EDIT': {
        setFolderId(data.id);
        setShowEditOrCreateFolderModal(true);
        break;
      }
      case 'DELETE': {
        setFolderId(data.id);
        setShowDeleteWarningModal(true);
        break;
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.leftContainer}>
        <div className={classes.header}>
          <Search value={searchValue} onChange={setSearchValue} />
          <AddButton
            tooltipLabel="Create folder"
            onClick={() => setShowEditOrCreateFolderModal(true)}
          />
        </div>
        <div className={classes.sidebarContainer}>
          {!_isEmpty(matchingFolders) ? (
            <Sidebar
              initialActiveOption={folders[0]?.id}
              sidebarOptions={matchingFolders}
              onClickOption={(args) => console.log(args)}
              handleAction={handleAction}
            />
          ) : (
            <div className={classes.noMatchText}>{'No match found'}</div>
          )}
        </div>
      </div>

      {showEditOrCreateFolderModal && (
        <EditOrCreateFolderModal
          closeModal={closeEditOrCreateFolderModal}
          folderId={folderId}
        />
      )}
      {showDeleteWarningModal && (
        <DeleteWarningModal
          closeModal={closeDeleteWarningModal}
          folderId={folderId}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const userDetails = state.userDetails;
  return { userId: userDetails.id };
};

export default compose(
  connect(mapStateToProps),
  withQuery(getUserFoldersQuery, {
    name: 'getUserFoldersQuery',
    fetchPolicy: 'cache-and-network',
    getVariables: ({ userId }) => ({ input: { id: userId, type: 'USER' } }),
    mapQueryDataToProps: ({ getUserFoldersQuery }) => {
      const { networkStatus, data } = getUserFoldersQuery;

      const isData = !_isEmpty(data);

      const isLoading = _includes([1, 2], networkStatus);

      const folderList = _pipe([
        (data) => _get(data, 'node.folders', []),
        (data) => _map(data, ({ id, name }) => ({ id, label: name })),
      ])(data);

      return { folders: folderList, isData, isLoading };
    },
    loadingContainerStyle,
  })
)(Resources);

Resources.displayName = 'Resources';
