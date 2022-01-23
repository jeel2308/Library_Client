/**--external-- */
import { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import isEmpty from 'lodash/isEmpty';

/**--internal-- */
import { FullScreenLoader } from './components';
import { AppContext, getUserInfoFromStorage } from './Utils';

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
function App() {
  const [showLoader, setShowLoader] = useState(false);

  const [userData, setUserData] = useState(() => getUserInfoFromStorage());

  const navigate = useNavigate();

  const isUserLoggedIn = !isEmpty(userData);

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate('/folders');
    } else {
      navigate('/');
    }
  }, []);

  const contextValues = useMemo(() => {
    return { setShowLoader, userData, isUserLoggedIn, setUserData };
  }, [userData]);

  return (
    <AppContext.Provider value={contextValues}>
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
    </AppContext.Provider>
  );
}

export default App;
