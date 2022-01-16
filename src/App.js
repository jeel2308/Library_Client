/**--external-- */
import { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';

/**--internal-- */
import { FullScreenLoader } from './components';
import { AppContext } from './Utils';

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

  const contextValues = useMemo(() => {
    return { setShowLoader };
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
