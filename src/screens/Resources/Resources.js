/**--external-- */
import React from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _pipe from 'lodash/flow';

/**--internal-- */
import { compose } from '../../Utils';
import { withQuery, Sidebar } from '../../components';
import { getUserFoldersQuery } from '../../modules/Queries';

/**--relative-- */
import classes from './Resources.module.scss';
import { loadingContainerStyle } from './ResourcesStyles';

const Resources = (props) => {
  const { folders } = props;

  return (
    <div className={classes.container}>
      <div className={classes.sidebarContainer}>
        <Sidebar
          sidebarOptions={folders}
          onClickOption={(args) => console.log(args)}
        />
      </div>
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
