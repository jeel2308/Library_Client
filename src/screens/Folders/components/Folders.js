/**--external-- */
import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import _size from 'lodash/size';
import { Text, Box } from '@chakra-ui/react';

/**--internal-- */
import { compose, getMatchingResults } from '#Utils';
import { Sidebar, withLoader } from '#components';
import { getUserFoldersEnhancer } from '#modules/QueryEnhancer';

/**--relative-- */
import classes from './Folders.module.scss';
import Search from './Search';
import { EditOrCreateFolderModal, DeleteWarningModal } from '#AppComponents';
import { getNextAvailableFolderId } from './FoldersUtils';
import { loadingContainerStyle } from './FoldersStyles';

const Resources = (props) => {
  const { folders } = props;

  const [searchValue, setSearchValue] = useState('');

  const [showEditOrCreateFolderModal, setShowEditOrCreateFolderModal] =
    useState(false);

  const totalFolders = _size(folders);

  const totalFoldersRef = useRef(totalFolders);

  const params = useParams();

  const [showDeleteWarningModal, setShowDeleteWarningModal] = useState(false);

  const [folderId, setFolderId] = useState(null);

  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedFolderId) {
      navigate(`${selectedFolderId}`);
    }
  }, [selectedFolderId]);

  /**
   * This effect will update state on initial mound and
   * when first folder is created
   */
  useEffect(() => {
    if (!selectedFolderId) {
      const folderId = params.folderId ? params.folderId : folders[0]?.id;
      setSelectedFolderId(folderId);
    } else if (totalFolders === 1 && totalFoldersRef.current === 0) {
      setSelectedFolderId(folders[0].id);
    }
  }, [totalFolders]);

  useEffect(() => {
    totalFoldersRef.current = totalFolders;
  }, [totalFolders]);

  const closeEditOrCreateFolderModal = useCallback(() => {
    setShowEditOrCreateFolderModal(false);
    setFolderId(null);
  }, []);

  const closeDeleteWarningModal = useCallback(() => {
    setShowDeleteWarningModal(false);
    setFolderId(null);
  }, []);

  const deleteFolderCallback = ({ folderId: deletedFolderId }) => {
    if (deletedFolderId === selectedFolderId) {
      const nextFolderId = getNextAvailableFolderId({
        folderId: selectedFolderId,
        folders,
      });

      if (nextFolderId) {
        setSelectedFolderId(nextFolderId);
      } else {
        navigate('../collections', { replace: true });
      }
    }
  };

  const matchingFolders = getMatchingResults({
    list: folders,
    field: 'label',
    searchText: searchValue,
  });

  const selectedFolder = useMemo(() => {
    return _find(folders, ({ id }) => id === selectedFolderId);
  }, [selectedFolderId, folders]);

  const handleActions = useCallback(({ data, type }) => {
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
  }, []);

  const outletProps = useMemo(() => {
    return {
      selectedFolder,
      handleActions,
    };
  }, [selectedFolder, handleActions]);

  return (
    <div className={classes.container}>
      <Box className={classes.leftContainer}>
        <Text className={classes.header}>Collections</Text>
        {!_isEmpty(folders) && (
          <Search value={searchValue} onChange={setSearchValue} />
        )}
        <div className={classes.sidebarContainer}>
          {!_isEmpty(matchingFolders) ? (
            <Sidebar
              activeOption={selectedFolderId}
              sidebarOptions={matchingFolders}
              onClickOption={({ id }) => setSelectedFolderId(id)}
            />
          ) : !_isEmpty(searchValue) ? (
            <div className={classes.noMatchText}>{'No match found'}</div>
          ) : null}
        </div>
      </Box>
      <Outlet context={outletProps} />
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
          deleteFolderCallback={deleteFolderCallback}
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
  getUserFoldersEnhancer({ loadingContainerStyle }),
  withLoader
)(Resources);

Resources.displayName = 'Resources';
