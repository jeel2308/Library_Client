/**--external-- */
import React from 'react';
import _map from 'lodash/map';

/**--internal-- */
import classes from './Sidebar.module.scss';
const Sidebar = (props) => {
  const { sidebarOptions, onClickOption } = props;
  return (
    <ul className={classes.container}>
      {_map(sidebarOptions, (option) => {
        return (
          <li key={option.id} className={classes.option}>
            <button
              className={classes.optionButton}
              onClick={() => onClickOption(option)}
            >
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Sidebar;
