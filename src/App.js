/**--external-- */
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useRoutes } from 'react-router-dom';
import _isEmpty from 'lodash/isEmpty';
import { gapi, loadAuth2 } from 'gapi-script';

/**--internal-- */
import { connect } from 'react-redux';
import { FullScreenLoader, ToastMessage } from './components';
import { setUserDetails, updateUserLoggedInStatus } from './modules/Module';
import { getUserInfoFromStorage } from './Utils';

/**--relative-- */
import {
  authenticationRoutes,
  foldersRoutes,
  NoMatch,
  Home,
  ProtectedRoute,
  profileRoutes,
} from './screens';
function App(props) {
  const { showLoader, setUserDetails, updateUserLoggedInStatus } = props;

  const [isComponentReady, setIsComponentReady] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const initClient = async () => {
      try {
        await loadAuth2(gapi, process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID, '');
      } catch (e) {
        console.error(e);
      }
    };
    initClient();
  }, []);

  useEffect(() => {
    const userDetails = getUserInfoFromStorage();

    const isUserLoggedIn = !_isEmpty(userDetails);

    setUserDetails(userDetails);
    updateUserLoggedInStatus(isUserLoggedIn);
    setIsComponentReady(true);
    if (isUserLoggedIn && location.pathname === '/') {
      navigate('/collections');
    }
  }, []);

  const element = useRoutes([
    {
      path: '/',
      element: <Home />,
    },
    {
      element: <ProtectedRoute />,
      children: [foldersRoutes, profileRoutes],
    },
    authenticationRoutes,
    {
      path: '*',
      element: <NoMatch />,
    },
  ]);

  return (
    <React.Fragment>
      {isComponentReady && element}

      {(showLoader || !isComponentReady) && <FullScreenLoader />}
      <ToastMessage />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  const { showLoader } = state;
  return { showLoader };
};

const mapActionCreators = {
  setUserDetails,
  updateUserLoggedInStatus,
};

export default connect(mapStateToProps, mapActionCreators)(App);
