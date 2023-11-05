/**--external-- */
import React, { useState } from 'react';
import { Input, Box, Button } from '@chakra-ui/react';
import _isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

/**--internal-- */
import { addLink } from '#modules/Module';

/**--relative-- */
import { inputStyle, inputContainerStyle } from './AddResourceStyles';

const AddResource = (props) => {
  const [url, setUrl] = useState('');
  const { addLink, folderId, searchText, linkAddedOrUpdatedCallback } = props;

  const onAddLinkClick = async () => {
    try {
      const addLinkPayload = {
        url,
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
    <Box
      display={'flex'}
      padding={3}
      gap={6}
      background="white"
      borderTop="1px solid rgba(0,0,0,0.2)"
    >
      <div style={inputContainerStyle}>
        <Input
          placeholder="enter url of resource"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={inputStyle}
        />
      </div>
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
  folderId: propTypes.string.isRequired,
  searchText: propTypes.string,
  linkAddedOrUpdatedCallback: propTypes.func,
};

export default connect(null, mapActionCreators)(AddResource);
AddResource.displayName = 'AddResource';
