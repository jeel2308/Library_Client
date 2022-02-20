/**--external-- */
import React from 'react';
import { Button } from '@chakra-ui/react';

/**--internal-- */
import { Modal, Form } from '#components';

/**--relative */
import classes from './EditOrCreateLinkModal.module.scss';
import { formFields } from './utils';

const EditOrCreateLinkModal = (props) => {
  const { closeModal, onSubmit } = props;
  return (
    <Modal onClickOutside={closeModal}>
      <div className={classes.container}>
        <Form
          fields={formFields}
          onSubmit={onSubmit}
          formButtonsElement={
            <div className={classes.footer}>
              <Button type="submit" colorScheme="blue">
                Add link
              </Button>
            </div>
          }
        />
      </div>
    </Modal>
  );
};

EditOrCreateLinkModal.displayName = 'EditOrCreateLinkModal';

export default EditOrCreateLinkModal;
