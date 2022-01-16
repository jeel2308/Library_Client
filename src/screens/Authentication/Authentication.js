/**--external-- */
import React from 'react';
import { Outlet } from 'react-router-dom';

/**--internal-- */
import { Modal } from '../../components';

/**--relative-- */
import { BANNER_URL } from './utils';
import './Authentication.css';

const Authentication = () => {
  return (
    <div className="authentication-container">
      <div className="authentication-banner">
        <figure className="authentication-figure">
          <img src={BANNER_URL} alt="banner" />
        </figure>
      </div>
      <Modal>
        <div className="authentication-overlay">
          <div className="authentication-content">
            <Outlet />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Authentication;

Authentication.displayName = 'Authentication';
