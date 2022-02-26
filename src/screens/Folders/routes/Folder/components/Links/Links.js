/**--external-- */
import React from 'react';
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

const Links = (props) => {
  const { folderDetails } = props;
  const { links } = folderDetails;

  const renderLinks = () => {
    if (_isEmpty(links)) {
      return 'No links';
    }
    return _map(links, (link) => {
      const { id } = link;
      return (
        <div key={id} className={classes.linkContainer}>
          <Link {...link} dropDownOptions={LINK_ACTIONS} />
        </div>
      );
    });
  };

  return <div className={classes.container}>{renderLinks()}</div>;
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
