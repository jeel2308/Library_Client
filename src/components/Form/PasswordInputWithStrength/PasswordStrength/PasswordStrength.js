/**--external-- */
import React from 'react';
import propTypes from 'prop-types';
import { Box } from '@chakra-ui/react';

const PasswordStrength = (props) => {
  const { min, max, value, containerBackgroundColor, barBackgroundColor } =
    props;

  let updatedValue = value;
  if (value < min) {
    updatedValue = min;
  }
  if (value > max) {
    updatedValue = max;
  }

  return (
    <Box
      backgroundColor={containerBackgroundColor}
      height={1}
      borderRadius={4}
      overflow="hidden"
    >
      <Box
        width={`${(updatedValue * 100) / (max - min)}%`}
        backgroundColor={barBackgroundColor}
        height="100%"
      ></Box>
    </Box>
  );
};

export default PasswordStrength;
PasswordStrength.displayName = 'PasswordStrength';

PasswordStrength.propTypes = {
  min: propTypes.number.isRequired,
  max: propTypes.number.isRequired,
  value: propTypes.number.isRequired,
  containerBackgroundColor: propTypes.string.isRequired,
  barBackgroundColor: propTypes.string.isRequired,
};
