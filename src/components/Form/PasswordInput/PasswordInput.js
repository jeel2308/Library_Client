/**--external-- */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';

const PasswordInput = (props) => {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const updatePasswordVisibility = useCallback(
    () => setPasswordVisibility((prev) => !prev),
    []
  );

  const {
    size,
    placeholder,
    borderColor,
    errorBorderColor,
    isInvalid,
    value,
    onChange,
    onBlur,
  } = props;
  return (
    <InputGroup size={size}>
      <Input
        pr={'16'}
        type={isPasswordVisible ? 'text' : 'password'}
        placeholder={placeholder}
        borderColor={borderColor}
        errorBorderColor={errorBorderColor}
        isInvalid={isInvalid}
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
  size: PropTypes.string,
  placeholder: PropTypes.string,
  borderColor: PropTypes.string,
  errorBorderColor: PropTypes.string,
  isInvalid: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

PasswordInput.displayName = 'PasswordInput';
