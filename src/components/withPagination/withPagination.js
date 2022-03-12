/**--external-- */
import React, { useMemo } from 'react';
import { Spinner } from '@chakra-ui/react';
import _throttle from 'lodash/throttle';

/**--internal-- */
import {
  checkScrollAtBottom,
  checkScrollAtTop,
  checkScrollAtLeft,
  checkScrollAtRight,
} from '#Utils';

/**--relative-- */
import classes from './withPagination.module.scss';

const withPagination = (configurations) => (WrappedComponent) => {
  const WithPagination = (props) => {
    const { networkStatus, fetchMore, hasNextPage } = props;

    const showLoader = networkStatus === 3;
    const { direction, loaderContainerStyle } = configurations;

    const onPageScroll = async (e, callback) => {
      const { target } = e;
      let isScrollCriteriaMet;
      switch (direction) {
        case 'LEFT': {
          isScrollCriteriaMet = checkScrollAtLeft(target);
          break;
        }
        case 'RIGHT': {
          isScrollCriteriaMet = checkScrollAtRight(target);
          break;
        }
        case 'TOP': {
          isScrollCriteriaMet = checkScrollAtTop(target);
          break;
        }
        case 'BOTTOM': {
          isScrollCriteriaMet = checkScrollAtBottom(target);
          break;
        }
      }

      if (hasNextPage && !showLoader && isScrollCriteriaMet) {
        await fetchMore();
        if (!!callback) {
          callback();
        }
      }
    };

    const renderLoader = ({ showLoader: showLoadingIcon = true }) => {
      return (
        showLoader &&
        showLoadingIcon && (
          <div
            className={classes.spinnerContainer}
            style={loaderContainerStyle}
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </div>
        )
      );
    };

    return (
      <WrappedComponent
        {...props}
        renderLoader={renderLoader}
        onPageScroll={onPageScroll}
      />
    );
  };

  WithPagination.displayName = 'WithPagination';

  return WithPagination;
};
export default withPagination;
