import Component from './components';
import { loginRoutes, registerRoutes } from './routes';

const plainRoutes = {
  element: <Component />,
  children: [loginRoutes, registerRoutes],
};

export default plainRoutes;
