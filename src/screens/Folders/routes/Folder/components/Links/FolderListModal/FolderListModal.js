/**--external-- */
import React from 'react';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import _map from 'lodash/map';

/**--internal-- */
import { Modal } from '#components';
import { compose } from '#Utils';
import { getUserFoldersEnhancer } from '#modules/QueryEnhancer';

/**--relative-- */
import classes from './FolderListModal.module.scss';

const FolderList = (props) => {
  const { folders } = props;

  return (
    <div className={classes.folderListContainer}>
      {_map(folders, (folder) => {
        return <div key={folder.id}>{folder.label}</div>;
      })}
    </div>
  );
};

const mapStateToProps = (state) => {
  const userId = _get(state, 'userDetails.id', '');
  return { userId };
};

const EnhancedFolderList = compose(
  connect(mapStateToProps),
  getUserFoldersEnhancer()
)(FolderList);

const FolderListModal = (props) => {
  const { closeModal } = props;
  return (
    <Modal onClickOutside={closeModal}>
      <div className={classes.container}>
        <EnhancedFolderList />
      </div>
    </Modal>
  );
};

export default FolderListModal;
