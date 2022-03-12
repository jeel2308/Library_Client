/**--external-- */
import React from 'react';
import { Button } from '@chakra-ui/react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';

/**--internal-- */
import { Modal, Form } from '#components';
import { addLink, updateLink } from '#modules/Module';
import { getLinkDetailsFromCache } from '#modules/GraphqlHelpers';
import { compose } from '#Utils';
import { getUserFoldersEnhancer } from '#modules/QueryEnhancer';

/**--relative */
import classes from './EditOrCreateLinkModal.module.scss';
import { formFields, getDynamicFormFields } from './utils';

const EditOrCreateLink = (props) => {
  const {
    closeModal,
    addLink,
    folderId,
    linkDetails,
    mode,
    linkId,
    updateLink,
    folders,
    defaultLinkStatus,
  } = props;

  const dynamicFormFields = getDynamicFormFields({
    formFields,
    data: {
      isCompleted: defaultLinkStatus,
      ...linkDetails,
      options: folders,
      folderId,
    },
  });

  const getUpdatedLinkData = ({ link, isCompleted, folderId }) => {
    const linkData = { folderId, isCompleted, id: linkId };
    const isLinkUrlUpdated = link !== linkDetails.url;
    return isLinkUrlUpdated ? { ...linkData, url: link } : linkData;
  };

  const onSubmit = ({ link, isCompleted = false, folderId }) => {
    if (mode === 'CREATE') {
      addLink({ url: link, isCompleted, folderId });
    } else {
      updateLink({
        linksDetails: [getUpdatedLinkData({ link, isCompleted, folderId })],
      });
    }

    closeModal();
  };

  return (
    <Form
      fields={dynamicFormFields}
      onSubmit={onSubmit}
      formButtonsElement={
        <div className={classes.footer}>
          <Button type="submit" colorScheme="blue">
            {mode === 'CREATE' ? 'Add link' : 'Update link'}
          </Button>
        </div>
      }
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const { linkId } = ownProps;

  const linkDetails = getLinkDetailsFromCache({ linkId });
  const mode = _isEmpty(linkDetails) ? 'CREATE' : 'EDIT';
  const userId = _get(state, 'userDetails.id', '');
  return { mode, linkDetails, userId };
};

const mapActionCreators = {
  addLink,
  updateLink,
};

const EnhancedEditOrCreateLink = compose(
  connect(mapStateToProps, mapActionCreators),
  getUserFoldersEnhancer()
)(EditOrCreateLink);

const EditOrCreateLinkModal = (props) => {
  const { closeModal, folderId, linkId, defaultLinkStatus } = props;

  return (
    <Modal onClickOutside={closeModal}>
      <div className={classes.container}>
        <EnhancedEditOrCreateLink
          closeModal={closeModal}
          folderId={folderId}
          linkId={linkId}
          defaultLinkStatus={defaultLinkStatus}
        />
      </div>
    </Modal>
  );
};

EditOrCreateLinkModal.displayName = 'EditOrCreateLinkModal';

export default EditOrCreateLinkModal;
