/**--external-- */
import React from 'react';
import _map from 'lodash/map';
import { Avatar } from '@chakra-ui/react';

/**--internal-- */
import classes from './Sidebar.module.scss';
const Sidebar = (props) => {
  const { sidebarOptions, onClickOption } = props;
  return (
    <ul className={classes.container}>
      {_map(sidebarOptions, (option) => {
        const { id, label } = option;
        return (
          <li key={id} className={classes.option}>
            <button
              className={classes.optionButton}
              onClick={() => onClickOption(option)}
            >
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
