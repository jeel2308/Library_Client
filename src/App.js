/**--external-- */
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import _isEmpty from 'lodash/isEmpty';

/**--internal-- */
import { connect } from 'react-redux';
import { FullScreenLoader, ToastMessage } from './components';
import { setUserDetails, updateUserLoggedInStatus } from './modules/Module';
import { getUserInfoFromStorage } from './Utils';

/**--relative-- */
import {
  Authentication,
  Resources,
  NoMatch,
  Home,
  Register,
  Login,
  ProtectedRoute,
} from './screens';
function App(props) {
  const { showLoader, setUserDetails, updateUserLoggedInStatus } = props;

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = getUserInfoFromStorage();

    const isUserLoggedIn = !_isEmpty(userDetails);

    setUserDetails(userDetails);
    updateUserLoggedInStatus(isUserLoggedIn);

    if (isUserLoggedIn && location.pathname === '/') {
      navigate('/folders');
    }
  }, []);

  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="folders/*" element={<Resources />} />
        </Route>

        <Route element={<Authentication />}>
          <Route element={<Register />} path="register" />
          <Route element={<Login />} path="login" />
        </Route>

        <Route path="*" element={<NoMatch />} />
      </Routes>

      {showLoader && <FullScreenLoader />}
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
