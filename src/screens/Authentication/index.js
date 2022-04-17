import Component from './components';
import { loginRoutes, registerRoutes, ResetPasswordRoutes } from './routes';

const plainRoutes = {
  element: <Component />,
  children: [loginRoutes, registerRoutes, ResetPasswordRoutes],
};

export default plainRoutes;
