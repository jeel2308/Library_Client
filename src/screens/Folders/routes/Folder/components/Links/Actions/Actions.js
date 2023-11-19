/**--external-- */
import React from 'react';
import propTypes from 'prop-types';
import { Button, Box } from '@chakra-ui/react';
import { IconContext } from 'react-icons';
import { BiX } from 'react-icons/bi';

/**--relative-- */
import { iconStyle } from './ActionStyles';

const Actions = (props) => {
  const { onActionClick, showMoveAction } = props;
  return (
    <Box display="flex" backgroundColor="white" alignItems="center" padding={3}>
      <Box marginLeft="auto" display="flex" gap={3}>
        {showMoveAction ? (
          <Button
            colorScheme="blue"
            onClick={() => onActionClick({ type: 'MOVE' })}
          >
            Move
          </Button>
        ) : null}
        <Button
          colorScheme="red"
          onClick={() => onActionClick({ type: 'DELETE' })}
        >
          Delete
        </Button>
      </Box>
      <Box marginLeft="auto">
        <Button
          leftIcon={
            <IconContext.Provider value={iconStyle}>
              <BiX />
            </IconContext.Provider>
          }
          colorScheme={'blue'}
          onClick={() => onActionClick({ type: 'CANCEL' })}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default Actions;

Actions.propTypes = {
  onActionClick: propTypes.func.isRequired,
  showMoveAction: propTypes.bool.isRequired,
};

Actions.displayName = 'Actions';
