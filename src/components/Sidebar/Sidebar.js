/**--external-- */
import React, { useState, useCallback } from 'react';
import _map from 'lodash/map';
import { Avatar } from '@chakra-ui/react';

/**--internal-- */
import { combineClasses } from '../../Utils';

/**--relative-- */
import classes from './Sidebar.module.scss';
const Sidebar = (props) => {
  const { sidebarOptions, onClickOption, initialActiveOption } = props;
  const [activeOption, setActiveOption] = useState(initialActiveOption);

  const updateActiveOption = useCallback((id) => setActiveOption(id), []);

  return (
    <ul className={classes.container}>
      {_map(sidebarOptions, (option) => {
        const { id, label } = option;

        const onOptionClick = () => {
          updateActiveOption(id);
          onClickOption(option);
        };

        const buttonClasses = combineClasses(classes.optionButton, {
          [classes.activeOptionButton]: id === activeOption,
        });

        return (
          <li key={id} className={classes.option}>
            <button className={buttonClasses} onClick={onOptionClick}>
              <Avatar name={label} size="sm" />
              <p className={classes.optionLabel}>{label}</p>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Sidebar;
