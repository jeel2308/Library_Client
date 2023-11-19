/**--external-- */
import React from 'react';
import propTypes from 'prop-types';
import { Button, Box, IconButton, Tooltip } from '@chakra-ui/react';
import { IconContext } from 'react-icons';
import { BiX, BiShare } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';

/**--relative-- */
import { iconStyle } from './ActionStyles';

const Actions = (props) => {
  const { onActionClick, showMoveAction } = props;
  return (
    <Box
      display="flex"
      backgroundColor="white"
      alignItems="center"
      padding={3}
      gap={3}
    >
      <Tooltip label="Cancel" aria-label="Cancel">
        <IconButton
          icon={
            <IconContext.Provider value={iconStyle}>
              <BiX />
            </IconContext.Provider>
          }
          onClick={() => onActionClick({ type: 'CANCEL' })}
          colorScheme="blue"
        />
      </Tooltip>
      <Tooltip label="Delete" aria-label="Delete">
        <IconButton
          icon={
            <IconContext.Provider value={iconStyle}>
              <AiOutlineDelete />
            </IconContext.Provider>
          }
          marginLeft={'auto'}
          colorScheme="red"
          onClick={() => onActionClick({ type: 'DELETE' })}
        />
      </Tooltip>

      {showMoveAction ? (
        <Tooltip label="Move" aria-label="Move">
          <IconButton
            icon={
              <IconContext.Provider value={iconStyle}>
                <BiShare />
              </IconContext.Provider>
            }
            onClick={() => onActionClick({ type: 'MOVE' })}
            colorScheme="blue"
          ></IconButton>
        </Tooltip>
      ) : null}
    </Box>
  );
};

export default Actions;

Actions.propTypes = {
  onActionClick: propTypes.func.isRequired,
  showMoveAction: propTypes.bool.isRequired,
};

Actions.displayName = 'Actions';
