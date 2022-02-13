/**--external-- */
import React, { useState, useCallback } from 'react';
import _map from 'lodash/map';
import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { IconContext } from 'react-icons';

/**--internal-- */
import { combineClasses } from '../../Utils';

/**--relative-- */
import classes from './Sidebar.module.scss';
import { dotsStyle, menuButtonStyle } from './SidebarStyles';
const Sidebar = (props) => {
  const { sidebarOptions, onClickOption, initialActiveOption, handleAction } =
    props;
  const [activeOption, setActiveOption] = useState(initialActiveOption);

  const updateActiveOption = useCallback((id) => setActiveOption(id), []);

  return (
    <ul className={classes.container}>
      {_map(sidebarOptions, (option) => {
        const { id, label } = option;

        const onOptionClick = (e) => {
          if (e.defaultPrevented) {
            return;
          }
          updateActiveOption(id);
          onClickOption(option);
        };

        const buttonClasses = combineClasses(classes.option, {
          [classes.activeOption]: id === activeOption,
        });

        return (
          <li key={id} className={buttonClasses} onClick={onOptionClick}>
            <div className={classes.leftContent}>
              <Avatar name={label} size="sm" />
              <p className={classes.optionLabel}>{label}</p>
            </div>
            <Menu>
              <MenuButton
                onClick={(e) =>
                  e.stopPropagation()
                } /**Here preventDefault will break dropdown behaviour */
                as={IconButton}
                aria-label={'Actions'}
                style={menuButtonStyle}
                icon={
                  <IconContext.Provider value={dotsStyle}>
                    <BiDotsVerticalRounded />
                  </IconContext.Provider>
                }
                variant={'unstyled'}
              />
              <MenuList>
                <MenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    handleAction({ data: option, type: 'EDIT' });
                  }}
                >
                  {'Edit'}
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    handleAction({ data: option, type: 'DELETE' });
                  }}
                >
                  {'Delete'}
                </MenuItem>
              </MenuList>
            </Menu>
          </li>
        );
      })}
    </ul>
  );
};

export default Sidebar;
