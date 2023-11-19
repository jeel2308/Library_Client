/**--external-- */
import React from 'react';
import _map from 'lodash/map';
import { Avatar, List, ListItem, Text, Box } from '@chakra-ui/react';
import { IconContext } from 'react-icons';
import { BiDotsVertical } from 'react-icons/bi';

/**--internal-- */
import { combineClasses } from '../../Utils';
import { Dropdown } from '#components';

/**--relative-- */
import classes from './Sidebar.module.scss';
import { avatarContainerStyle, dotsStyle } from './SidebarStyles';

const Sidebar = (props) => {
  const { options, activeOption, onClickOption, actions, handleActions } =
    props;

  return (
    <List className={classes.container} width="100%">
      {_map(options, (option) => {
        const { id, label } = option;

        const optionClasses = combineClasses(classes.option, {
          [classes.activeOption]: id === activeOption,
        });

        const onOptionClick = (e) => {
          if (e.defaultPrevented) {
            return;
          }
          onClickOption(option);
        };

        return (
          <ListItem key={id} className={optionClasses} onClick={onOptionClick}>
            <Box className={classes.optionDetails}>
              <Avatar name={label} size="sm" style={avatarContainerStyle} />
              <Text fontWeight="600">{label}</Text>
            </Box>
            <Dropdown
              variant="unstyled"
              options={actions}
              dropdownButtonType="icon"
              handleActions={({ value }) =>
                handleActions({ type: value, data: { id } })
              }
              icon={
                <IconContext.Provider value={dotsStyle}>
                  <BiDotsVertical />
                </IconContext.Provider>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default Sidebar;
