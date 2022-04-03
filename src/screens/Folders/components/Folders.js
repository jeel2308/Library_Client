/**--external-- */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';

/**--internal-- */
import { compose, getMatchingResults } from '#Utils';
import { Sidebar } from '#components';
import { getUserFoldersEnhancer } from '#modules/QueryEnhancer';

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

  const params = useParams();

  const [showDeleteWarningModal, setShowDeleteWarningModal] = useState(false);

  const [folderId, setFolderId] = useState(null);

  const [selectedFolderId, setSelectedFolderId] = useState(() => {
    return params.folderId ? params.folderId : folders[0]?.id;
  });

  const navigate = useNavigate();

  useEffect(() => {
    navigate(`${selectedFolderId}`);
  }, [selectedFolderId]);

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

  const selectedFolder = useMemo(() => {
    return _find(folders, ({ id }) => id === selectedFolderId);
  }, [selectedFolderId, folders]);

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
      default: {
        return;
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.leftContainer}>
        <div className={classes.header}>
          <AddButton
            tooltipLabel="Create folder"
            onClick={() => setShowEditOrCreateFolderModal(true)}
          />
        </div>
        <div className={classes.searchContainer}>
          <Search value={searchValue} onChange={setSearchValue} />
        </div>
        <div className={classes.sidebarContainer}>
          {!_isEmpty(matchingFolders) ? (
            <Sidebar
              activeOption={selectedFolderId}
              sidebarOptions={matchingFolders}
              onClickOption={({ id }) => setSelectedFolderId(id)}
              handleAction={handleAction}
            />
          ) : (
            <div className={classes.noMatchText}>{'No match found'}</div>
          )}
        </div>
      </div>
      <Outlet context={selectedFolder} />
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
  getUserFoldersEnhancer({ loadingContainerStyle })
)(Resources);

Resources.displayName = 'Resources';
