/**--external-- */
import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

/**--internal-- */
import { AppContext } from '../../Utils';

const ProtectedRoute = () => {
  const navigate = useNavigate();

  const { isUserLoggedIn } = useContext(AppContext);

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate('/');
    }
  }, [isUserLoggedIn]);

  return isUserLoggedIn && <Outlet />;
};

export default ProtectedRoute;

ProtectedRoute.displayName = 'ProtectedRoute';
