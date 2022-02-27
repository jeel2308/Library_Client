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

const Links = (props) => {
  const { folderDetails, folderId, deleteLink, isCompleted, updateLink } =
    props;
  const { links } = folderDetails;

  const [showEditLinkModal, setShowEditLinkModal] = useState(false);

  const [selectedLinks, setSelectedLinks] = useState([]);

  const [linkId, setLinkId] = useState(null);

  const [showBulkSelection, setShowBulkSelection] = useState(false);

  useEffect(() => {
    setSelectedLinks([]);
    disableBulkSelectionMode();
  }, [folderId]);

  const openEditLinkModal = ({ linkId }) => {
    setShowEditLinkModal(true);
    setLinkId(linkId);
  };

  const closeEditLinkModal = () => {
    setShowEditLinkModal(false);
    setLinkId(null);
  };
  const enableBulkSelectionMode = useCallback(
    () => setShowBulkSelection(true),
    []
  );
  const disableBulkSelectionMode = useCallback(
    () => setShowBulkSelection(false),
    []
  );

  const handleActions = ({ value, linkId }) => {
    switch (value) {
      case 'EDIT': {
        openEditLinkModal({ linkId });
        break;
      }
      case 'DELETE': {
        deleteLink({ linkId, isCompleted, folderId });
        break;
      }

      case 'MARK_AS_PENDING':
      case 'MARK_AS_COMPLETE': {
        updateLink({
          linkDetails: { id: linkId, isCompleted: !isCompleted },
        });
        break;
      }
      case 'SELECT': {
        enableBulkSelectionMode();
        break;
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
