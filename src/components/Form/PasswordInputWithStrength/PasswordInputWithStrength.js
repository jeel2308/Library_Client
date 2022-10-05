/**--external-- */
import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
  FormLabel,
  FormControl,
  Box,
  IconButton,
  UnorderedList,
  ListItem,
  Collapse,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';
import { BsInfoCircle } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import { BiX } from 'react-icons/bi';

/**--relative-- */
import { passwordStrengthCloseButtonStyle } from './PasswordInputWithStregthStyles';
import PasswordInput from '../PasswordInput';
import PasswordStrength from './PasswordStrength';

const PASSWORD_STRENGTH_LABEL_BY_SCORE = [
  'Worst',
  'Bad',
  'Weak',
  'Good',
  'Strong',
];

const PASSWORD_COLOR_BY_SCORE = [
  'red.500',
  'red.500',
  'orange.400',
  'blue.300',
  'green.500',
];

const PasswordInputWithStrength = (props) => {
  const { label, errorMessage, id, value, onChange, onBlur, placeholder } =
    props;

  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);

  const togglePasswordHelpVisibility = () => {
    setShowPasswordHelp((showPasswordHelp) => !showPasswordHelp);
  };

  const onPasswordChange = (e) => {
    const value = e.target.value;
    const { score } = window.zxcvbn?.(value) ?? { score: 0 };
    console.log({ score });
    setPasswordScore(score);
    onChange(e);
  };

  return (
    <FormControl isInvalid={!!errorMessage}>
      {/**Setting marginInlineEnd to override margin added by chakra default styling */}
      <FormLabel htmlFor={id} marginInlineEnd={0}>
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
      </FormLabel>
      <PasswordInput
        id={id}
        borderColor={'blackAlpha.500'}
        value={value}
        onChange={onPasswordChange}
        onBlur={onBlur}
        placeholder={placeholder}
        size={'md'}
      />
      {errorMessage ? (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      ) : value ? (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box width="70%">
            <PasswordStrength
              min={0}
              max={4}
              value={passwordScore}
              containerBackgroundColor="blackAlpha.300"
              barBackgroundColor={PASSWORD_COLOR_BY_SCORE[passwordScore]}
            />
          </Box>
          <Text color={PASSWORD_COLOR_BY_SCORE[passwordScore]} fontWeight={600}>
            {PASSWORD_STRENGTH_LABEL_BY_SCORE[passwordScore]}
          </Text>
        </Box>
      ) : null}
    </FormControl>
  );
};

export default PasswordInputWithStrength;
PasswordInputWithStrength.displayName = 'PasswordInputWithStrength';

PasswordInputWithStrength.defaultProps = {
  label: propTypes.string.isRequired,
  errorMessage: propTypes.string,
  id: propTypes.string,
  value: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  onBlur: propTypes.func,
  placeholder: propTypes.string,
};
