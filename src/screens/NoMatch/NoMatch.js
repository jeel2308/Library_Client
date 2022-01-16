/**--external-- */
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Heading } from '@chakra-ui/react';

/**--relative-- */
import './NoMatch.css';

const NoMatch = () => {
  return (
    <div className="no-match-container">
      <Heading as="h2" size={'2xl'}>
        Page not found
      </Heading>
      <Heading as="h4" size={'md'} mt="4" className="no-match-sub-header">
        Go to
        <Link to="/" className="no-match-link">
          <Button colorScheme={'blue'} variant={'link'} ml={'2'}>
            Home page
          </Button>
        </Link>
      </Heading>
    </div>
  );
};

NoMatch.displayName = 'NoMatch';

export default NoMatch;
