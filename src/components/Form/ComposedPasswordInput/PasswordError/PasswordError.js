/**--external-- */
import React from 'react';
import { FormErrorMessage } from '@chakra-ui/react';
import propTypes from 'prop-types';

const PasswordError = (props) => {
  const { children } = props;
  return <FormErrorMessage>{children}</FormErrorMessage>;
};

export default PasswordError;
PasswordError.displayName = 'PasswordError';

PasswordError.propTypes = {
  children: propTypes.oneOfType([propTypes.string, propTypes.object])
    .isRequired,
};
