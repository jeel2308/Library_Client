/**--external-- */
import React, { useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _size from 'lodash/size';
import { Text, Box, Avatar } from '@chakra-ui/react';
import { IconContext } from 'react-icons';
import { BiDotsHorizontal } from 'react-icons/bi';

/**--internal-- */
import { scrollToBottom } from '#Utils';
import { Dropdown } from '#components';

/**--relative-- */
import classes from './Folder.module.scss';
import { avatarContainerStyle, dotsStyle } from './FolderStyles';
import Links from './Links';
import { FOLDER_ACTIONS } from './FolderUtils';

const Folder = () => {
  const { selectedFolder: folderBasicDetails, handleActions } =
    useOutletContext();

  const linkScrollRef = useRef(null);
  const linksNodeRefs = useRef([]);
  const previousFiltersRef = useRef({
    folderId: '',
    linkStatus: '',
  });

  const setLinkScrollRef = (node) => {
    linkScrollRef.current = node;
  };

  const setLinkNodesRef = (node, index) => {
    linksNodeRefs.current[index] = node;
  };

  const folderName = _get(folderBasicDetails, 'label', 'Anonymous');
  const folderId = _get(folderBasicDetails, 'id', '');

  const scrollLinkFeed = (operationDetails) => {
    const { type } = operationDetails;
    switch (type) {
      case 'ADD_LINK': {
        const allLinks = linksNodeRefs.current ?? [];
        if (!_isEmpty(allLinks)) {
          const lastLinkNode = allLinks[_size(allLinks) - 1];
          lastLinkNode?.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      }
      case 'FETCH_MORE': {
        const { oldCountOfLinks } = operationDetails;
        const newLinks = linksNodeRefs.current ?? [];
        if (!_isEmpty(newLinks)) {
          const indexOfTopMostLink = _size(newLinks) - oldCountOfLinks - 1;
          const totalVerticalDistance =
            linksNodeRefs.current?.[indexOfTopMostLink]?.getBoundingClientRect()
              .top ?? 0;
          linkScrollRef.current.scrollTop = totalVerticalDistance - 75 - 75;
        }

        break;
      }
      case 'DELETE_LINK': {
        break;
      }
      case 'FEED_REFRESH': {
        const { folderId: previousFolderId } = previousFiltersRef.current;

        if (folderId !== previousFolderId) {
          scrollToBottom(linkScrollRef.current);
          previousFiltersRef.current = {
            folderId,
          };
        }

        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <div className={classes.container}>
      <Box className={classes.header} p={6}>
        <Box className={classes.collectionDetails}>
          <Avatar style={avatarContainerStyle} name={folderName} size="sm" />
          <Text fontWeight={600} fontSize="md">
            {folderName}
          </Text>
        </Box>
        <Dropdown
          variant="unstyled"
          options={FOLDER_ACTIONS}
          dropdownButtonType="icon"
          handleActions={({ value }) =>
            handleActions({ type: value, data: { id: folderId } })
          }
          icon={
            <IconContext.Provider value={dotsStyle}>
              <BiDotsHorizontal />
            </IconContext.Provider>
          }
        />
      </Box>

      <Links
        folderId={folderId}
        setLinkScrollRef={setLinkScrollRef}
        setLinkNodesRef={setLinkNodesRef}
        scrollLinkFeed={scrollLinkFeed}
      />
    </div>
  );
};

export default Folder;
