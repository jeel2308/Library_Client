/**--external-- */
import React, { useState } from 'react';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _includes from 'lodash/includes';
import _map from 'lodash/map';

/**--internal-- */
import { withQuery } from '#components';
import { getFolderDetailsQuery } from '#modules/Queries';

/**--relative-- */
import classes from './Links.module.scss';
import Link from './Link';
import { LINK_ACTIONS } from './LinkUtils';
import EditOrCreateLinkModal from '../EditOrCreateLinkModal';

const Links = (props) => {
  const { folderDetails, folderId } = props;
  const { links } = folderDetails;

  const [showEditLinkModal, setShowEditLinkModal] = useState(false);

  const [linkId, setLinkId] = useState(null);

  const openEditLinkModal = ({ linkId }) => {
    setShowEditLinkModal(true);
    setLinkId(linkId);
  };

  const closeEditLinkModal = () => {
    setShowEditLinkModal(false);
    setLinkId(null);
  };

  const handleActions = ({ value, linkId }) => {
    switch (value) {
      case 'EDIT': {
        openEditLinkModal({ linkId });
        break;
      }
    }
  };

  const renderLinks = () => {
    if (_isEmpty(links)) {
      return 'No links';
    }
    return _map(links, (link) => {
      const { id } = link;
      return (
        <div key={id} className={classes.linkContainer}>
          <Link
            {...link}
            dropDownOptions={LINK_ACTIONS}
            handleActions={handleActions}
          />
        </div>
      );
    });
  };

  return (
    <div className={classes.container}>
      {renderLinks()}
      {showEditLinkModal && (
        <EditOrCreateLinkModal
          linkId={linkId}
          closeModal={closeEditLinkModal}
          folderId={folderId}
        />
      )}
    </div>
  );
};

export default withQuery(getFolderDetailsQuery, {
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
})(Links);
