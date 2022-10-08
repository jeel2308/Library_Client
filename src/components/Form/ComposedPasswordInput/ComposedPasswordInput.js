/**--external-- */
import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { FormControl } from '@chakra-ui/react';

/**--relative-- */
import { ComposedPasswordInputContext } from './ComposedPasswordInputContext';
import PasswordInput from './PasswordInput';
import PasswordLabel from './PasswordLabel';
import PasswordError from './PasswordError';
import PasswordStrength from './PasswordStrength';

const ComposedPasswordInput = (props) => {
  const { children, id, isInvalid, value } = props;

  const contextValue = useMemo(() => {
    return { id, value };
  }, [id, value]);

  return (
    <ComposedPasswordInputContext.Provider value={contextValue}>
      <FormControl isInvalid={isInvalid}>{children}</FormControl>
    </ComposedPasswordInputContext.Provider>
  );
};

export default ComposedPasswordInput;
ComposedPasswordInput.displayName = 'ComposedPasswordInput';

ComposedPasswordInput.propTypes = {
  children: propTypes.array.isRequired,
  id: propTypes.string.isRequired,
  isInvalid: propTypes.bool,
  value: propTypes.string.isRequired,
};

ComposedPasswordInput.Label = PasswordLabel;
ComposedPasswordInput.Input = PasswordInput;
ComposedPasswordInput.Error = PasswordError;
ComposedPasswordInput.PasswordStrength = PasswordStrength;
