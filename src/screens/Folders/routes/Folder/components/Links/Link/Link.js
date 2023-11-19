/**--external-- */
import React from 'react';
import propTypes from 'prop-types';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import { Text, Image, Box, Link as ChakraLink } from '@chakra-ui/react';
import _noop from 'lodash/noop';

/**--internal-- */
import { Dropdown } from '#components';

/**--relative-- */
import { dotsStyle } from './LinkStyles';
//This will not work with js aliasing
import * as fallbackUrl from '../../../../../../../assests/linkBackupImage.jpeg';

import classes from './Link.module.scss';

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
    <Box className={classes.container}>
      <Box className={classes.topContainer}>
        <Box className={classes.linkContainer} onClick={onLinkClick}>
          <ChakraLink href={url} className={classes.link}>
            {url}
          </ChakraLink>
        </Box>
        <Box display="flex" flexShrink={0}>
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
      {showMetadata ? (
        <Box className={classes.linkDetails}>
          <Text as="h5" size="md">
            {title}
          </Text>
          <Text fontSize={'sm'} className={classes.linkDescription}>
            {description}
          </Text>
          <Image
            src={thumbnail}
            fallbackSrc={fallbackUrl.default}
            border="1px solid rgba(0,0,0,0.1)"
            borderRadius={'8px'}
            flexShrink={0}
          />
        </Box>
      ) : null}
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
