/**--external-- */
import React, { useContext, useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { Box, Text } from '@chakra-ui/react';

/**--relative-- */
import { ComposedPasswordInputContext } from '../ComposedPasswordInputContext';

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

const PasswordStrength = (props) => {
  const [passwordScore, setPasswordScore] = useState(0);

  const { value } = useContext(ComposedPasswordInputContext);

  useEffect(() => {
    const { score } = window.zxcvbn?.(value) ?? { score: 0 };
    setPasswordScore(score);
  }, [value]);

  const { min, max, containerBackgroundColor, barBackgroundColor } = props;

  let updatedPasswordScore = passwordScore;
  if (passwordScore < min) {
    updatedPasswordScore = min;
  }
  if (passwordScore > max) {
    updatedPasswordScore = max;
  }

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box width="70%">
        <Box
          backgroundColor={containerBackgroundColor}
          height={1}
          borderRadius={4}
          overflow="hidden"
        >
          <Box
            width={`${(updatedPasswordScore * 100) / (max - min)}%`}
            backgroundColor={barBackgroundColor}
            height="100%"
          ></Box>
        </Box>
      </Box>
      <Text color={PASSWORD_COLOR_BY_SCORE[passwordScore]} fontWeight={600}>
        {PASSWORD_STRENGTH_LABEL_BY_SCORE[passwordScore]}
      </Text>
    </Box>
  );
};

export default PasswordStrength;
PasswordStrength.displayName = 'PasswordStrength';

PasswordStrength.propTypes = {
  min: propTypes.number.isRequired,
  max: propTypes.number.isRequired,
  containerBackgroundColor: propTypes.string.isRequired,
  barBackgroundColor: propTypes.string.isRequired,
};
