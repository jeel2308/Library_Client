/**--external-- */
import React from 'react';
import { Button } from '@chakra-ui/react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

/**--internal-- */
import { Modal, Form } from '../../../components';
import { createFolder, updateFolder } from '../../../modules/Module';
import { getFolderDetailsFromCache } from '../../../modules/GraphqlHelpers';

/**--relative-- */
import { formFields, getDynamicFormFields } from './utils';
import classes from './EditOrCreateFolderModal.module.scss';
const EditOrCreateFolderModal = (props) => {
  const { createFolder, closeModal, folderDetails, mode, updateFolder } = props;

  const onSubmit = (data) => {
    if (mode === 'CREATE') {
      createFolder({ name: data.folder });
    } else {
      updateFolder({ name: data.folder, id: folderDetails.id });
    }

    closeModal();
  };

  const dynamicFormFields = getDynamicFormFields({
    formFields,
    data: folderDetails,
  });

  return (
    <Modal onClickOutside={closeModal}>
      <div className={classes.container}>
        <Form
          fields={dynamicFormFields}
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

const mapStateToProps = (_, ownProps) => {
  const { folderId } = ownProps;
  const folderDetails = getFolderDetailsFromCache({ folderId });
  const mode = _isEmpty(folderDetails) ? 'CREATE' : 'UPDATE';
  return { folderDetails, mode };
};

const mapActionCreators = {
  createFolder,
  updateFolder,
};

export default connect(
  mapStateToProps,
  mapActionCreators
)(EditOrCreateFolderModal);

EditOrCreateFolderModal.displayName = 'EditOrCreateFolderModal';
