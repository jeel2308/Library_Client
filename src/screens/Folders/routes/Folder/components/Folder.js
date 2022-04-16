/**--external-- */
import React, { useState, useMemo, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import _get from 'lodash/get';
import _debounce from 'lodash/debounce';
import { Text } from '@chakra-ui/react';

/**--internal-- */
import { SegmentControl } from '#components';

/**--relative-- */
import classes from './Folder.module.scss';
import AddButton from './AddButton';
import EditOrCreateLinkModal from './EditOrCreateLinkModal';
import Links from './Links';
import SearchBar from './SearchBar';
import { ADD_LINK } from './FolderUtils';

const segmentControlOptions = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Completed', value: 'COMPLETED' },
];
const Folder = () => {
  const [linkStatus, setLinkStatus] = useState(
    () => segmentControlOptions[0].value
  );

  const [showEditOrCreateLinkModal, setShowEditOrCreateLinkModal] =
    useState(false);

  const [linkOperation, setLinkOperation] = useState(null);

  const [searchText, setSearchText] = useState('');

  const updateSearchText = useMemo(() => {
    return _debounce((value) => setSearchText(value), 300);
  }, []);

  const closeModal = useCallback(() => setShowEditOrCreateLinkModal(false), []);
  const openModal = useCallback(() => setShowEditOrCreateLinkModal(true), []);

  const folderBasicDetails = useOutletContext();

  const folderName = _get(folderBasicDetails, 'label', 'Anonymous');
  const folderId = _get(folderBasicDetails, 'id', '');

  const isCompleted = linkStatus !== 'PENDING';

  const linkAddedOrUpdatedCallback = () => {
    setLinkOperation(ADD_LINK);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.headerFirstRow}>
          <Text fontSize="xl">{folderName}</Text>
          <div className={classes.segmentContainer}>
            <SegmentControl
              options={segmentControlOptions}
              activeValue={linkStatus}
              onOptionClick={({ value }) => setLinkStatus(value)}
            />
          </div>
          <AddButton onClick={openModal} />
        </div>
        <div className={classes.headerSecondRow}>
          <SearchBar
            key={folderId}
            value={searchText}
            onChange={updateSearchText}
          />
        </div>
      </div>

      <Links
        folderId={folderId}
        isCompleted={isCompleted}
        linkOperation={linkOperation}
        setLinkOperation={setLinkOperation}
        searchText={searchText}
        updateSearchText={setSearchText}
      />

      {showEditOrCreateLinkModal && (
        <EditOrCreateLinkModal
          closeModal={closeModal}
          folderId={folderId}
          defaultLinkStatus={isCompleted}
          linkAddedOrUpdatedCallback={linkAddedOrUpdatedCallback}
        />
      )}
    </div>
  );
};

export default Folder;
