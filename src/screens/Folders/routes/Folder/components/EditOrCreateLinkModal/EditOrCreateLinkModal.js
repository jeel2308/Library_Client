/**--external-- */
import React from 'react';
import { Button } from '@chakra-ui/react';
import { connect } from 'react-redux';

/**--internal-- */
import { Modal, Form } from '#components';
import { addLink } from '#modules/Module';

/**--relative */
import classes from './EditOrCreateLinkModal.module.scss';
import { formFields } from './utils';

const EditOrCreateLinkModal = (props) => {
  const { closeModal, addLink, folderId } = props;

  const onSubmit = ({ link, isCompleted }) => {
    addLink({ url: link, isCompleted, folderId });
    closeModal();
  };

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

const mapActionCreators = {
  addLink,
};

EditOrCreateLinkModal.displayName = 'EditOrCreateLinkModal';

export default connect(null, mapActionCreators)(EditOrCreateLinkModal);
