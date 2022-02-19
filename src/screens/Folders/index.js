import Component from './components';
import { folderRoutes } from './routes';

const plainRoutes = {
  path: 'folders',
  element: <Component />,
  children: [folderRoutes],
};

export default plainRoutes;
