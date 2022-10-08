/**--external-- */
import React from 'react';
import propTypes from 'prop-types';
import { Box } from '@chakra-ui/react';

/**--relative-- */
import ComposedPasswordInput from '../ComposedPasswordInput';

const BasicPasswordInput = (props) => {
  const { id, label, value, onChange, onBlur, placeholder, errorMessage } =
    props;

  return (
    <ComposedPasswordInput id={id} value={value} isInvalid={!!errorMessage}>
      <ComposedPasswordInput.Label>
        <Box fontSize={16}> {label}</Box>
      </ComposedPasswordInput.Label>
      <ComposedPasswordInput.Input
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
      />
      {errorMessage ? (
        <ComposedPasswordInput.Error>
          {errorMessage}
        </ComposedPasswordInput.Error>
      ) : null}
    </ComposedPasswordInput>
  );
};

export default BasicPasswordInput;
BasicPasswordInput.displayName = 'BasicPasswordInput';

BasicPasswordInput.propTypes = {
  errorMessage: propTypes.oneOfType([propTypes.string, propTypes.object]),
  id: propTypes.string.isRequired,
  label: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  onBlur: propTypes.func,
  placeholder: propTypes.string,
  value: propTypes.string.isRequired,
};
