/**--external-- */
import React, { useState } from 'react';
import { Button, Text } from '@chakra-ui/react';

/**--internal-- */
import { EditOrCreateFolderModal } from '#AppComponents';

/**--relative-- */
import classes from './NoFolders.module.scss';

const NoFolders = () => {
  const [showModal, setShowModal] = useState(false);

  const onButtonClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={classes.container}>
      <Text>No collections found</Text>
      <Button colorScheme="blue" onClick={onButtonClick}>
        Create new collection
      </Button>
      {showModal && <EditOrCreateFolderModal closeModal={closeModal} />}
    </div>
  );
};

export default NoFolders;

NoFolders.displayName = 'NoFolders';
