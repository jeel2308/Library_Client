/**--external-- */
import React from 'react';
import { Button } from '@chakra-ui/react';
import { connect } from 'react-redux';

/**--internal-- */
import { Modal, Form } from '../../../components';
import { createFolder } from '../../../modules/Module';

/**--relative-- */
import { formFields } from './utils';
import classes from './EditOrCreateFolderModal.module.scss';
const EditOrCreateFolderModal = (props) => {
  const { createFolder, closeModal } = props;

  const onSubmit = async (data) => {
    const success = await createFolder({ name: data.folder });
    if (success) {
      closeModal();
    }
  };

  return (
    <Modal onClickOutside={closeModal}>
      <div className={classes.container}>
        <Form
          fields={formFields}
          onSubmit={onSubmit}
          formButtonsElement={
            <div className={classes.footer}>
              <Button
                colorScheme={'blue'}
                type={'submit'}
              >{`Create folder`}</Button>
            </div>
          }
        />
      </div>
    </Modal>
  );
};

const mapActionCreators = {
  createFolder,
};

export default connect(null, mapActionCreators)(EditOrCreateFolderModal);

EditOrCreateFolderModal.displayName = 'EditOrCreateFolderModal';
