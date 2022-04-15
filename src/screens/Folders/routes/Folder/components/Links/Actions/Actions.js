/**--external-- */
import React from 'react';
import { Button } from '@chakra-ui/react';

/**--relative-- */
import classes from './Actions.module.scss';

const Actions = (props) => {
  const {
    onCancelClick,
    onDeleteClick,
    totalSelectedLinks,
    statusButtonLabel,
    onUpdateStatusClick,
    onMoveClick,
  } = props;
  return (
    <div className={classes.container}>
      <Button variant="unstyled" onClick={onCancelClick} marginRight="auto">
        Cancel
      </Button>
      <Button
        colorScheme="blue"
        disabled={!totalSelectedLinks}
        onClick={onUpdateStatusClick}
      >
        {statusButtonLabel}
      </Button>
      <Button
        colorScheme="blue"
        disabled={!totalSelectedLinks}
        onClick={onMoveClick}
      >
        Move
      </Button>
      <Button
        colorScheme="red"
        onClick={onDeleteClick}
        disabled={!totalSelectedLinks}
      >
        Delete
      </Button>
    </div>
  );
};

export default Actions;

Actions.displayName = 'Actions';
