/**--external-- */
import React from 'react';
import { Button } from '@chakra-ui/react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

/**--internal-- */
import { Modal, Form } from '#components';
import { addLink } from '#modules/Module';
import { getLinkDetailsFromCache } from '#modules/GraphqlHelpers';

/**--relative */
import classes from './EditOrCreateLinkModal.module.scss';
import { formFields, getDynamicFormFields } from './utils';

const EditOrCreateLinkModal = (props) => {
  const { closeModal, addLink, folderId, linkDetails } = props;

  const dynamicFormFields = getDynamicFormFields({
    formFields,
    data: linkDetails,
  });

  const onSubmit = ({ link, isCompleted = false }) => {
    addLink({ url: link, isCompleted, folderId });
    closeModal();
  };

  return (
    <Modal onClickOutside={closeModal}>
      <div className={classes.container}>
        <Form
          fields={dynamicFormFields}
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

const mapStateToProps = (_, ownProps) => {
  const { linkId } = ownProps;

  const linkDetails = getLinkDetailsFromCache({ linkId });
  return _isEmpty(linkDetails) ? {} : { linkDetails };
};

const mapActionCreators = {
  addLink,
};

EditOrCreateLinkModal.displayName = 'EditOrCreateLinkModal';

export default connect(
  mapStateToProps,
  mapActionCreators
)(EditOrCreateLinkModal);
