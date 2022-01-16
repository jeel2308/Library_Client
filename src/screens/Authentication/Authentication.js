/**--external-- */
import React from 'react';
import { Outlet } from 'react-router-dom';

/**--internal-- */
import { Modal } from '../../components';

/**--relative-- */
import { BANNER_URL } from './utils';
import classes from './Authentication.module.css';

const Authentication = () => {
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
            <Outlet />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Authentication;

Authentication.displayName = 'Authentication';
