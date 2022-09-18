/**--external-- */
import React, { useState } from 'react';
import { Input, Box, Button } from '@chakra-ui/react';
import _isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

/**--internal-- */
import { addLink } from '#modules/Module';

const AddResource = (props) => {
  const [url, setUrl] = useState('');
  const {
    addLink,
    isCompleted,
    folderId,
    searchText,
    linkAddedOrUpdatedCallback,
  } = props;

  const onAddLinkClick = async () => {
    try {
      const addLinkPayload = {
        url,
        isCompleted,
        folderId,
        searchText,
      };
      const data = await addLink(addLinkPayload);
      linkAddedOrUpdatedCallback &&
        linkAddedOrUpdatedCallback({ ...data, folderId });

      setUrl('');
    } catch {}
  };

  return (
    <Box display={'flex'} padding={6} gap={6} background="white">
      <Input
        placeholder="enter url of resource"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button
        colorScheme={'blue'}
        disabled={_isEmpty(url)}
        onClick={onAddLinkClick}
      >
        Add
      </Button>
    </Box>
  );
};

const mapActionCreators = {
  addLink,
};

AddResource.propTypes = {
  addLink: propTypes.func.isRequired,
  isCompleted: propTypes.bool.isRequired,
  folderId: propTypes.string.isRequired,
  searchText: propTypes.string,
  linkAddedOrUpdatedCallback: propTypes.func,
};

export default connect(null, mapActionCreators)(AddResource);
AddResource.displayName = 'AddItem';
