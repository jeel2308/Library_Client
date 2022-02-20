/**--external-- */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import { Text } from '@chakra-ui/react';

/**--internal-- */
import { withRouter, SegmentControl } from '#components';
import { getFolderBasicDetailsFromCache } from '#modules/GraphqlHelpers';
import { compose } from '#Utils';

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

  const { folderBasicDetails } = props;

  const folderName = _get(folderBasicDetails, 'name', 'Anonymous');

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

const mapStateToProps = (_, ownProps) => {
  const { folderId } = ownProps;
  const folderBasicDetails = getFolderBasicDetailsFromCache({ folderId });
  return { folderBasicDetails };
};

export default compose(withRouter, connect(mapStateToProps))(Folder);
