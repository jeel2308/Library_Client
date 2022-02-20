/**--external-- */
import React, { useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import _get from 'lodash/get';
import { Text } from '@chakra-ui/react';

/**--internal-- */
import { SegmentControl } from '#components';

/**--relative-- */
import classes from './Folder.module.scss';
import AddButton from './AddButton';
import EditOrCreateLinkModal from './EditOrCreateLinkModal';

const segmentControlOptions = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Completed', value: 'COMPLETED' },
];
const Folder = (props) => {
  const [linkStatus, setLinkStatus] = useState(
    () => segmentControlOptions[0].value
  );

  const [showEditOrCreateLinkModal, setShowEditOrCreateLinkModal] =
    useState(false);

  const closeModal = useCallback(() => setShowEditOrCreateLinkModal(false), []);
  const openModal = useCallback(() => setShowEditOrCreateLinkModal(true), []);

  const folderBasicDetails = useOutletContext();
  const folderName = _get(folderBasicDetails, 'label', 'Anonymous');

  return (
    <div className={classes.container}>
      <div className={classes.header}>
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
      <div className={classes.middleContainer}></div>
      {showEditOrCreateLinkModal && (
        <EditOrCreateLinkModal
          closeModal={closeModal}
          folderId={_get(folderBasicDetails, 'id')}
        />
      )}
    </div>
  );
};

export default Folder;
