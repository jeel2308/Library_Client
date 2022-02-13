/**--external-- */
import React from 'react';
import { Heading, Text, ButtonGroup, Button } from '@chakra-ui/react';

/**--internal-- */
import { Modal } from '../../../components';

/**--relative-- */
import classes from './DeleteWarningModal.module.scss';

const DeleteWarningModal = (props) => {
  const { closeModal } = props;
  return (
    <Modal onClickOutside={closeModal}>
      <div className={classes.container}>
        <Heading as={'h3'} fontSize={'xl'}>
          Delete Folder
        </Heading>
        <Text mt={'4'}>
          Are you sure you want to delete this folder?You will lose all articles
          that belong to this folder
        </Text>
        <ButtonGroup mt={'10'} display={'flex'} justifyContent={'flex-end'}>
          <Button onClick={closeModal}>Cancel</Button>
          <Button colorScheme={'red'}>Delete</Button>
        </ButtonGroup>
      </div>
    </Modal>
  );
};

export default DeleteWarningModal;

DeleteWarningModal.displayName = 'DeleteWarningModal';
