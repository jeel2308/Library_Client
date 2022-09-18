/**--external-- */
import React from 'react';
import { Tabs, TabList, Tab } from '@chakra-ui/react';
import _map from 'lodash/map';

/**--relative-- */
import classes from './SegmentControl.module.scss';
import { selectedTabStyle } from './SegmentControlStyles';

const SegmentControl = (props) => {
  const { options, onOptionClick } = props;

  return (
    <Tabs defaultIndex={0} variant="unstyled" className={classes.container}>
      <TabList>
        {_map(options, (option) => {
          const { label, value } = option;
          return (
            <Tab
              _selected={selectedTabStyle}
              width={'200px'}
              fontSize={16}
              key={value}
              onClick={() => onOptionClick(option)}
            >
              {label}
            </Tab>
          );
        })}
      </TabList>
    </Tabs>
  );
};

export default SegmentControl;
