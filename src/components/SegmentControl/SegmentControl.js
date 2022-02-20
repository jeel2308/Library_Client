/**--external-- */
import React from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import _map from 'lodash/map';

/**--relative-- */
import classes from './SegmentControl.module.scss';

const SegmentControl = (props) => {
  const { options, onOptionClick, activeValue } = props;

  return (
    <ButtonGroup spacing={1} flex={1} className={classes.container}>
      {_map(options, (option, index) => {
        const { label, value } = option;

        return (
          <Button
            isFullWidth
            key={value}
            colorScheme={value === activeValue ? 'purple' : 'gray'}
            onClick={() => onOptionClick(option)}
          >
            {label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default SegmentControl;
