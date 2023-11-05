import Component from './components';
import { folderRoutes, noFolderRoutes } from './routes';

const plainRoutes = {
  path: 'collections',
  element: <Component />,
  children: [folderRoutes, noFolderRoutes],
};

export default plainRoutes;
