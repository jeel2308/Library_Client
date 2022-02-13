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
import { compose, getMatchingResults } from '../../Utils';
import { withQuery, Sidebar } from '../../components';
import { getUserFoldersQuery } from '../../modules/Queries';

/**--relative-- */
import classes from './Resources.module.scss';
import AddButton from './AddButton';
import Search from './Search';
import EditOrCreateFolderModal from './EditOrCreateFolderModal';
import { loadingContainerStyle } from './ResourcesStyles';

const Resources = (props) => {
  const { folders } = props;

  const [searchValue, setSearchValue] = useState('');

  const [showEditOrCreateFolderModal, setShowEditOrCreateFolderModal] =
    useState(false);

  const closeEditOrCreateFolderModal = useCallback(() => {
    setShowEditOrCreateFolderModal(false);
  }, []);

  const matchingFolders = getMatchingResults({
    list: folders,
    field: 'label',
    searchText: searchValue,
  });

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
            />
          ) : (
            <div className={classes.noMatchText}>{'No match found'}</div>
          )}
        </div>
      </div>
      {showEditOrCreateFolderModal && (
        <EditOrCreateFolderModal closeModal={closeEditOrCreateFolderModal} />
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
    name: 'folders',
    fetchPolicy: 'cache-and-network',
    getVariables: ({ userId }) => ({ input: { id: userId, type: 'USER' } }),
    mapQueryDataToProps: ({ folders }) => {
      const folderList = _pipe([
        (data) => _get(data, 'node.folders', []),
        (data) => _map(data, ({ id, name }) => ({ id, label: name })),
      ])(folders);
      return { folders: folderList };
    },
    loadingContainerStyle,
  })
)(Resources);

Resources.displayName = 'Resources';
