/**--external-- */
import React from 'react';
import _map from 'lodash/map';
import { Avatar, List, ListItem, Text } from '@chakra-ui/react';

/**--internal-- */
import { combineClasses } from '../../Utils';

/**--relative-- */
import classes from './Sidebar.module.scss';
import { avatarContainerStyle } from './SidebarStyles';

const Sidebar = (props) => {
  const { sidebarOptions, activeOption, onClickOption } = props;

  return (
    <List className={classes.container} width="100%">
      {_map(sidebarOptions, (option) => {
        const { id, label } = option;

        const optionClasses = combineClasses(classes.option, {
          [classes.activeOption]: id === activeOption,
        });

        const onOptionClick = () => {
          onClickOption(option);
        };

        return (
          <ListItem
            key={id}
            padding={3}
            gap={3}
            className={optionClasses}
            onClick={onOptionClick}
          >
            <Avatar name={label} size="sm" style={avatarContainerStyle} />
            <Text fontWeight="600">{label}</Text>
          </ListItem>
        );
      })}
    </List>
  );
};

export default Sidebar;
