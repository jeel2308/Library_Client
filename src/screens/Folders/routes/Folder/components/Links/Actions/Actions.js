/**--external-- */
import React from 'react';
import { ButtonGroup, Button } from '@chakra-ui/react';

/**--relative-- */
import classes from './Actions.module.scss';

const Actions = (props) => {
  const { onCancelClick } = props;
  return (
    <div className={classes.container}>
      <ButtonGroup spacing="3">
        <Button variant="unstyled" onClick={onCancelClick}>
          Cancel
        </Button>
        <Button colorScheme="blue">Mark as complete</Button>
        <Button colorScheme="red">Delete</Button>
      </ButtonGroup>
    </div>
  );
};

export default Actions;

Actions.displayName = 'Actions';
