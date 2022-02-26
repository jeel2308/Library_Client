/**--external-- */
import React from 'react';

/**--relative-- */
import classes from './Link.module.scss';

const Link = (props) => {
  const { url } = props;
  return (
    <div className={classes.container}>
      <a href={url} target={'_blank'} className={classes.link}>
        {url}
      </a>
    </div>
  );
};

export default Link;
