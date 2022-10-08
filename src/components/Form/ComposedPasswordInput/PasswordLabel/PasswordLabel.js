/**--external-- */
import React, { useContext } from 'react';
import { FormLabel } from '@chakra-ui/react';
import propTypes from 'prop-types';

/**--relative-- */
import { ComposedPasswordInputContext } from '../ComposedPasswordInputContext';

const PasswordLabel = (props) => {
  const { children } = props;
  const { id } = useContext(ComposedPasswordInputContext);

  return (
    <FormLabel htmlFor={id} marginInlineEnd={0}>
      {children}
    </FormLabel>
  );
};

export default PasswordLabel;
PasswordLabel.displayName = 'PasswordLabel';

PasswordLabel.propTypes = {
  children: propTypes.oneOfType([propTypes.string, propTypes.element]),
};
