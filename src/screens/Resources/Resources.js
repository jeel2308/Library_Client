/**--external-- */
import React from 'react';
import { useQuery } from '@apollo/client';
import { useToast, Button } from '@chakra-ui/react';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _map from 'lodash/map';

/**--relative-- */
import { getUserFoldersQuery } from '../../modules/Queries';
import { createFolder } from '../../modules/Module';

const Resources = () => {
  // const {
  //   setShowLoader,
  //   userData: { id },
  // } = useContext(AppContext);
  // const setToast = useToast();

  // const { loading, error, data } = useQuery(getUserFoldersQuery, {
  //   variables: { input: { id, type: 'USER' } },
  // });

  // const onCreateFolder = async ({ name }) => {
  //   await createFolder({ setToast, setLoadingState: setShowLoader, name });
  // };

  // const folders = _get(data, 'node.folders', []);

  // if (_isEmpty(folders)) {
  //   return (
  //     <div>
  //       No Folders
  //       <Button
  //         onClick={() => onCreateFolder({ name: 'Test' })}
  //         colorScheme={'blue'}
  //       >
  //         Create one
  //       </Button>
  //     </div>
  //   );
  // }

  // if (loading) {
  //   return <div>Loading</div>;
  // }
  // return (
  //   <div>
  //     <Button
  //       onClick={() => onCreateFolder({ name: 'Test' })}
  //       colorScheme={'blue'}
  //     >
  //       Create one
  //     </Button>
  //     Resources
  //     {_map(folders, ({ name, id }) => (
  //       <div key={id}> {name}</div>
  //     ))}
  //   </div>
  // );
  return <div>Test</div>;
};

export default Resources;

Resources.displayName = 'Resources';
