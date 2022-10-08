/**--external-- */
import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
  Box,
  IconButton,
  UnorderedList,
  ListItem,
  Collapse,
} from '@chakra-ui/react';
import { BsInfoCircle } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import { BiX } from 'react-icons/bi';

/**--relative-- */
import { passwordStrengthCloseButtonStyle } from './PasswordInputWithStregthStyles';
import ComposedPasswordInput from '../ComposedPasswordInput';

const PasswordInputWithStrength = (props) => {
  const { label, errorMessage, id, value, onChange, onBlur, placeholder } =
    props;

  const [showPasswordHelp, setShowPasswordHelp] = useState(false);

  const togglePasswordHelpVisibility = () => {
    setShowPasswordHelp((showPasswordHelp) => !showPasswordHelp);
  };

  return (
    <ComposedPasswordInput id={id} value={value} isInvalid={!!errorMessage}>
      <ComposedPasswordInput.Label>
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            {label}
            <IconButton
              variant="unstyled"
              display="flex"
              height="auto"
              onClick={togglePasswordHelpVisibility}
            >
              <BsInfoCircle />
            </IconButton>
          </Box>
          <Collapse in={showPasswordHelp} animateOpacity>
            <Box
              overflow="hidden"
              display="flex"
              alignItems="flex-start"
              bg="gray.100"
              padding={2}
              mt={2}
              borderRadius={4}
            >
              <UnorderedList>
                <ListItem>
                  Password should contain at least 8 characters.
                </ListItem>
                <ListItem>
                  Password should contain both uppercase and lowercase letters.
                </ListItem>
                <ListItem>
                  Password should contain numbers and special characters(@,#
                  etc).
                </ListItem>
              </UnorderedList>
              <IconButton
                onClick={togglePasswordHelpVisibility}
                variant="unstyled"
                display="flex"
                height="auto"
              >
                <IconContext.Provider value={passwordStrengthCloseButtonStyle}>
                  <BiX />
                </IconContext.Provider>
              </IconButton>
            </Box>
          </Collapse>
        </Box>
      </ComposedPasswordInput.Label>
      <ComposedPasswordInput.Input
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
      />
      {errorMessage ? (
        <ComposedPasswordInput.Error>
          {errorMessage}
        </ComposedPasswordInput.Error>
      ) : value ? (
        <ComposedPasswordInput.PasswordStrength />
      ) : null}
    </ComposedPasswordInput>
  );
};

export default PasswordInputWithStrength;
PasswordInputWithStrength.displayName = 'PasswordInputWithStrength';

PasswordInputWithStrength.defaultProps = {
  label: propTypes.string.isRequired,
  errorMessage: propTypes.oneOfType([propTypes.string, propTypes.object]),
  id: propTypes.string,
  value: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  onBlur: propTypes.func,
  placeholder: propTypes.string,
};
