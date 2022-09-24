/**--external-- */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import _get from 'lodash/get';
import _debounce from 'lodash/debounce';
import _isEmpty from 'lodash/isEmpty';
import _size from 'lodash/size';
import { Text } from '@chakra-ui/react';

/**--internal-- */
import { SegmentControl } from '#components';
import { scrollToBottom } from '#Utils';

/**--relative-- */
import classes from './Folder.module.scss';
import Links from './Links';
import SearchBar from './SearchBar';

const segmentControlOptions = [
  { label: 'Borrowed', value: 'PENDING' },
  { label: 'Archives', value: 'COMPLETED' },
];
const Folder = () => {
  const [linkStatus, setLinkStatus] = useState(
    () => segmentControlOptions[0].value
  );
  const [searchText, setSearchText] = useState('');

  const updateSearchText = useMemo(() => {
    return _debounce((value) => setSearchText(value), 300);
  }, []);

  const folderBasicDetails = useOutletContext();

  const linkScrollRef = useRef(null);
  const linksNodeRefs = useRef([]);
  const previousFiltersRef = useRef({
    folderId: '',
    linkStatus: '',
    searchText: '',
  });

  const setLinkScrollRef = (node) => {
    linkScrollRef.current = node;
  };

  const setLinkNodesRef = (node, index) => {
    linksNodeRefs.current[index] = node;
  };

  const folderName = _get(folderBasicDetails, 'label', 'Anonymous');
  const folderId = _get(folderBasicDetails, 'id', '');

  useEffect(() => {
    setSearchText('');
  }, [folderId]);

  const isCompleted = linkStatus !== 'PENDING';

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
        const {
          folderId: previousFolderId,
          linkStatus: previousLinkStatus,
          searchText: previousSearchText,
        } = previousFiltersRef.current;

        if (
          folderId !== previousFolderId ||
          linkStatus !== previousLinkStatus ||
          searchText !== previousSearchText
        ) {
          scrollToBottom(linkScrollRef.current);
          previousFiltersRef.current = {
            folderId,
            linkStatus,
            searchText,
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
      <div className={classes.header}>
        <div className={classes.headerFirstRow}>
          <Text fontSize="xl">{folderName}</Text>
          <div className={classes.segmentControlContainer}>
            <SegmentControl
              options={segmentControlOptions}
              activeValue={linkStatus}
              onOptionClick={({ value }) => setLinkStatus(value)}
            />
          </div>
        </div>
        <div className={classes.headerSecondRow}>
          <SearchBar key={folderId} onChange={updateSearchText} />
        </div>
      </div>

      <Links
        folderId={folderId}
        isCompleted={isCompleted}
        searchText={searchText}
        updateSearchText={setSearchText}
        setLinkScrollRef={setLinkScrollRef}
        setLinkNodesRef={setLinkNodesRef}
        scrollLinkFeed={scrollLinkFeed}
      />
    </div>
  );
};

export default Folder;
