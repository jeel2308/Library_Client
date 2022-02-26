/**--external-- */
import React from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { IconContext } from 'react-icons';

/**--internal-- */
import { Dropdown } from '#components';

/**--relative-- */
import classes from './Link.module.scss';
import { dotsStyle } from './LinkStyles';

const Link = (props) => {
  const { url, dropDownOptions, id } = props;

  const handleActions = ({ value }) => {
    props.handleActions({ value, linkId: id });
  };

  return (
    <div className={classes.container}>
      <a href={url} target={'_blank'} className={classes.link}>
        {url}
      </a>
      <div className={classes.dropDownContainer}>
        <Dropdown
          variant="unstyled"
          options={dropDownOptions}
          dropdownButtonType="icon"
          handleActions={handleActions}
          icon={
            <IconContext.Provider value={dotsStyle}>
              <BiDotsVerticalRounded />
            </IconContext.Provider>
          }
        />
      </div>
    </div>
  );
};

Link.displayName = 'Link';

export default Link;
