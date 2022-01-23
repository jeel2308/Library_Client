/**--external-- */
import React, { useContext, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

/**--internal-- */
import { Modal } from '../../components';
import { AppContext } from '../../Utils';

/**--relative-- */
import { BANNER_URL } from './utils';
import classes from './Authentication.module.scss';

const Authentication = () => {
  const { isUserLoggedIn } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate('/folder');
    }
  }, [isUserLoggedIn]);

  const element = (
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

  return !isUserLoggedIn && element;
};

export default Authentication;

Authentication.displayName = 'Authentication';
