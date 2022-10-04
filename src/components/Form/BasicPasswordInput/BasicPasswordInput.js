/**--external-- */
import React from 'react';
import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react';
import propTypes from 'prop-types';

/**--relative-- */
import PasswordInput from '../PasswordInput';

const BasicPasswordInput = (props) => {
  const { id, label, value, onChange, onBlur, placeholder, errorMessage } =
    props;

  return (
    <FormControl isInvalid={!!errorMessage}>
      <FormLabel htmlFor={id} fontSize={16}>
        {label}
      </FormLabel>
      <PasswordInput
        id={id}
        borderColor={'blackAlpha.500'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        size={'md'}
      />
      {errorMessage ? (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default BasicPasswordInput;
BasicPasswordInput.displayName = 'BasicPasswordInput';

BasicPasswordInput.propTypes = {
  errorMessage: propTypes.string,
  id: propTypes.string.isRequired,
  label: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  onBlur: propTypes.func,
  placeholder: propTypes.string,
  value: propTypes.string.isRequired,
};
