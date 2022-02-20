/**--external-- */
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import _get from 'lodash/get';
import { Text } from '@chakra-ui/react';

/**--internal-- */
import { SegmentControl } from '#components';

/**--relative-- */
import classes from './Folder.module.scss';

const segmentControlOptions = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Completed', value: 'COMPLETED' },
];
const Folder = (props) => {
  const [linkStatus, setLinkStatus] = useState(
    () => segmentControlOptions[0].value
  );

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
      </div>
    </div>
  );
};

export default Folder;
