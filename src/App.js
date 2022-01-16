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
} from './screens';
function App() {
  const [showLoader, setShowLoader] = useState(false);

  const navigate = useNavigate();

  const toast = useToast();

  useEffect(() => {
    const userInfo = getUserInfoFromStorage();
    if (isEmpty(userInfo)) {
      navigate('/');
      return;
    }
    navigate('/resources');
  }, []);

  const contextValues = useMemo(() => {
    return { setShowLoader, toast };
  }, []);

  return (
    <AppContext.Provider value={contextValues}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="resources/*" element={<Resources />} />
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
