/**--external-- */
import React, { useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import { Heading, Text } from '@chakra-ui/react';

/**--internal-- */
import { Dropdown } from '#components';

/**--relative-- */
import classes from './Link.module.scss';
import { dotsStyle } from './LinkStyles';

const Metadata = (props) => {
  const { title, description, thumbnail, onLinkMetadataLoaded } = props;

  const [showThumbnail, setShowThumbnail] = useState(() => !!thumbnail);

  const onImageLoadError = () => {
    setShowThumbnail(false);
    onLinkMetadataLoaded();
  };

  return (
    <div className={classes.linkMetadataContainer}>
      {title && (
        <Heading as="h5" size={'md'}>
          {title}
        </Heading>
      )}
      {description && (
        <Text fontSize={'sm'} colorScheme="blackAlpha">
          {description}
        </Text>
      )}
      {showThumbnail && (
        <figure className={classes.thumbnail}>
          <img
            src={thumbnail}
            alt={title}
            onError={onImageLoadError}
            onLoad={onLinkMetadataLoaded}
          />
        </figure>
      )}
    </div>
  );
};

const Link = (props) => {
  const {
    url,
    dropDownOptions,
    title,
    thumbnail,
    description,
    id,
    onLinkMetadataLoaded,
    onLinkClick,
  } = props;

  const handleActions = ({ value }) => {
    props.handleActions({ value, linkId: id });
  };

  const showMetadata = title || thumbnail || description;

  return (
    <div className={classes.container} onClick={onLinkClick}>
      <div className={classes.firstRow}>
        <Text className={classes.link}>{url}</Text>

        <div className={classes.dropDownContainer}>
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
        </div>
      </div>
      {showMetadata && (
        <Metadata
          title={title}
          description={description}
          thumbnail={thumbnail}
          onLinkMetadataLoaded={onLinkMetadataLoaded}
        />
      )}
    </div>
  );
};

Link.displayName = 'Link';

export default Link;
