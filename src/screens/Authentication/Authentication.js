/**--external-- */
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

/**--internal-- */
import { Modal, FullScreenLoader } from '../../components';

/**--relative-- */
import { BANNER_URL } from './utils';
import classes from './Authentication.module.scss';

const Authentication = () => {
  const [showLoader, setShowLoader] = useState(false);
  return (
    <div className={classes.container}>
      <div className={classes.banner}>
        <figure className={classes.figure}>
          <img src={BANNER_URL} alt="banner" />
        </figure>
      </div>
      <Modal>
        <div className={classes.overlay}>
          <div className={classes.content}>
            <Outlet context={setShowLoader} />
          </div>
        </div>
      </Modal>
      {showLoader && <FullScreenLoader />}
    </div>
  );
};

export default Authentication;

Authentication.displayName = 'Authentication';
