/**--external-- */
import { Routes, Route } from 'react-router-dom';

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
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="resources/*" element={<Resources />} />
      <Route element={<Authentication />}>
        <Route element={<Register />} path="register" />
        <Route element={<Login />} path="login" />
      </Route>

      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;
