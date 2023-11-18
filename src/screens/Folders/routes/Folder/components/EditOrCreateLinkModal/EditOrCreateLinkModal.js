/**--external-- */
import React from 'react';
import { Button } from '@chakra-ui/react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';

/**--internal-- */
import { Modal, Form, withLoader } from '#components';
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
    linkAddedOrUpdatedCallback,
  } = props;

  const dynamicFormFields = getDynamicFormFields({
    formFields,
    data: {
      ...linkDetails,
      options: folders,
      folderId,
    },
  });

  const getPayloadToUpdateLink = ({ link, folderId: updatedFolderId }) => {
    const linkData = { id: linkId };

    const isLinkUrlUpdated = link !== linkDetails.url;
    const isFolderUpdated = updatedFolderId !== folderId;

    if (isLinkUrlUpdated) {
      linkData.url = link;
    }

    if (isFolderUpdated) {
      linkData.folderId = updatedFolderId;
    }

    return linkData;
  };

  const onSubmit = async ({ link, folderId: updatedFolderId }) => {
    try {
      if (mode === 'CREATE') {
        const createLinkPayload = {
          url: link,
          folderId,
        };

        const data = await addLink(createLinkPayload);

        linkAddedOrUpdatedCallback &&
          linkAddedOrUpdatedCallback({ ...data, folderId });
      } else {
        const payloadToUpdateLink = getPayloadToUpdateLink({
          link,
          folderId: updatedFolderId,
        });

        const [data] = await updateLink({
          linksDetails: [payloadToUpdateLink],
          oldFolderId: folderId,
        });

        linkAddedOrUpdatedCallback &&
          linkAddedOrUpdatedCallback({ ...data, folderId });
      }

      closeModal();
    } catch {}
  };

  return (
    <Form
      fields={dynamicFormFields}
      onSubmit={onSubmit}
      formButtonsElement={
        <div className={classes.footer}>
          <Button type="submit" colorScheme="blue">
            {mode === 'CREATE' ? 'Add resource' : 'Update resource'}
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
  getUserFoldersEnhancer(),
  withLoader
)(EditOrCreateLink);

const EditOrCreateLinkModal = (props) => {
  const {
    closeModal,
    folderId,
    linkId,
    defaultLinkStatus,
    linkAddedOrUpdatedCallback,
  } = props;

  return (
    <Modal onClickOutside={closeModal}>
      <div className={classes.container}>
        <EnhancedEditOrCreateLink
          closeModal={closeModal}
          folderId={folderId}
          linkId={linkId}
          defaultLinkStatus={defaultLinkStatus}
          linkAddedOrUpdatedCallback={linkAddedOrUpdatedCallback}
        />
      </div>
    </Modal>
  );
};

EditOrCreateLinkModal.displayName = 'EditOrCreateLinkModal';

export default EditOrCreateLinkModal;
