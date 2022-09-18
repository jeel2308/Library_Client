/**--external-- */
import React from 'react';
import propTypes from 'prop-types';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import { Heading, Text, Image, Box } from '@chakra-ui/react';
import _noop from 'lodash/noop';

/**--internal-- */
import { Dropdown } from '#components';

/**--relative-- */
import { dotsStyle } from './LinkStyles';
//This will not work with js aliasing
import * as fallbackUrl from '../../../../../../../assests/linkBackupImage.jpeg';

const Link = (props) => {
  const {
    url,
    dropDownOptions,
    title,
    thumbnail,
    description,
    id,
    onLinkClick,
  } = props;

  const handleActions = ({ value }) => {
    props.handleActions({ value, linkId: id });
  };

  const showMetadata = title || thumbnail || description;

  return (
    <Box
      display="flex"
      gap={3}
      width="600px"
      borderRadius={'8px'}
      backgroundColor="white"
      boxShadow={
        '0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 1px 5px 0 rgba(0, 0, 0, 0.1)'
      }
      cursor="pointer"
      padding={3}
      onClick={onLinkClick}
    >
      {!showMetadata ? (
        <Text
          display="flex"
          flex={1}
          flexWrap="wrap"
          wordBreak="break-all"
          color="blue"
        >
          {url}
        </Text>
      ) : (
        <React.Fragment>
          <Image
            src={thumbnail}
            width={'200px'}
            height="104px"
            fallbackSrc={fallbackUrl.default}
            border="1px solid rgba(0,0,0,0.1)"
            borderRadius={'8px'}
            flexShrink={0}
          />
          <Box gap={1} display="flex" flexDirection="column" flex={1}>
            <Heading as="h5" size="md">
              {title}
            </Heading>
            <Text fontSize={'sm'} colorScheme="blackAlpha">
              {description}
            </Text>
          </Box>
        </React.Fragment>
      )}
      <Box display="flex">
        <Dropdown
          variant="unstyled"
          options={dropDownOptions}
          dropdownButtonType="icon"
          handleActions={handleActions}
          icon={
            <IconContext.Provider value={dotsStyle}>
              <BiDotsVerticalRounded />
            </IconContext.Provider>
          }
        />
      </Box>
    </Box>
  );
};

Link.displayName = 'Link';

Link.defaultProps = {
  onMetadataLoaded: _noop,
};

Link.propTypes = {
  url: propTypes.string.isRequired,
  dropDownOptions: propTypes.array.isRequired,
  title: propTypes.string,
  thumbnail: propTypes.string,
  description: propTypes.string,
  id: propTypes.string.isRequired,
  onLinkClick: propTypes.func.isRequired,
};

export default Link;
