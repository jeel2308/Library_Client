/**--external-- */
import React from 'react';
import { IconContext } from 'react-icons';
import { BiPlusCircle } from 'react-icons/bi';

/**--internal-- */
import { withTooltip } from '#components';

/**--relative-- */
import classes from './AddButton.modules.scss';
import { addButtonStyle } from './AddButtonStyles';

const AddButton = (props) => {
  const { onClick } = props;
  return (
    <button className={classes.container} onClick={onClick}>
      <IconContext.Provider value={addButtonStyle}>
        <BiPlusCircle />
      </IconContext.Provider>
    </button>
  );
};

export default withTooltip(AddButton);

AddButton.displayName = 'AddButton';
