/**--external-- */
import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';

/**--relative-- */
import { AppContext } from '../../Utils';
import { getFolders } from '../../modules/Queries';

const Resources = () => {
  const {
    userData: { id },
  } = useContext(AppContext);
  const { loading, error, data } = useQuery(getFolders, { variables: { id } });
  console.log(data, error);
  if (loading) {
    return <div>Loading</div>;
  }
  return <div>Resources</div>;
};

export default Resources;

Resources.displayName = 'Resources';
