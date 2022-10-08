/**--external-- */
import React, { useContext, useState, useEffect } from 'react';
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

const MIN = 0;

const MAX = 4;

const PasswordStrength = () => {
  const [passwordScore, setPasswordScore] = useState(0);

  const { value } = useContext(ComposedPasswordInputContext);

  useEffect(() => {
    const { score } = window.zxcvbn?.(value) ?? { score: 0 };
    setPasswordScore(score);
  }, [value]);

  let updatedPasswordScore = passwordScore;
  if (passwordScore < MIN) {
    updatedPasswordScore = MIN;
  }
  if (passwordScore > MAX) {
    updatedPasswordScore = MAX;
  }

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box width="70%">
        <Box
          backgroundColor="blackAlpha.300"
          height={1}
          borderRadius={4}
          overflow="hidden"
        >
          <Box
            width={`${(updatedPasswordScore * 100) / (MAX - MIN)}%`}
            backgroundColor={PASSWORD_COLOR_BY_SCORE[passwordScore]}
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
