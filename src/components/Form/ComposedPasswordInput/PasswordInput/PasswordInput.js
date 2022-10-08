/**--external-- */
import React, { useState, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';

/**--relative-- */
import { ComposedPasswordInputContext } from '../ComposedPasswordInputContext';

const PasswordInput = (props) => {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const { value, id } = useContext(ComposedPasswordInputContext);

  const updatePasswordVisibility = useCallback(
    () => setPasswordVisibility((prev) => !prev),
    []
  );

  const { placeholder, onChange, onBlur } = props;
  return (
    <InputGroup size={'md'}>
      <Input
        pr={'16'}
        id={id}
        type={isPasswordVisible ? 'text' : 'password'}
        placeholder={placeholder}
        borderColor={'blackAlpha.500'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      <InputRightElement width={'16'}>
        <Button size={'sm'} onClick={updatePasswordVisibility} m={'1'}>
          {isPasswordVisible ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;

PasswordInput.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

PasswordInput.displayName = 'PasswordInput';
