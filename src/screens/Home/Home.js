/**--external-- */
import React from 'react';
import {
  Heading,
  UnorderedList,
  ListItem,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

/**--internal-- */
import { Modal } from '../../components';

/**--relative-- */
import './Home.css';
import { buttonGroupStyles } from './HomeStyles';
import {
  HOME_BANNER,
  TITLE_ELEMENT,
  TITLE_FONT_SIZE,
  LIST_FONT_SIZE,
  LIST_ITEM_ELEMENT,
} from './utils';

const Home = () => {
  return (
    <div className="home-container">
      <figure className="home-figure">
        <img src={HOME_BANNER} alt="home-banner" />
      </figure>
      <Modal>
        <div className="home-overlay">
          <ButtonGroup spacing={'6'} style={buttonGroupStyles}>
            <Link to={'register'}>
              <Button colorScheme={'blue'}>Sign up</Button>
            </Link>
            <Link to={'login'}>
              <Button colorScheme={'blue'}>Sign in</Button>
            </Link>
          </ButtonGroup>
          <div className="home-content">
            <Heading as={TITLE_ELEMENT} size={TITLE_FONT_SIZE}>
              One place to keep all online articles
            </Heading>
            <UnorderedList mt={'6'}>
              <ListItem>
                <Heading as={LIST_ITEM_ELEMENT} size={LIST_FONT_SIZE}>
                  Manage articles easily
                </Heading>
              </ListItem>
              <ListItem>
                <Heading as={LIST_ITEM_ELEMENT} size={LIST_FONT_SIZE} mt={'2'}>
                  Group articles by subject
                </Heading>
              </ListItem>
              <ListItem>
                <Heading as={LIST_ITEM_ELEMENT} size={LIST_FONT_SIZE} mt={'2'}>
                  Track articles status
                </Heading>
              </ListItem>
            </UnorderedList>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;

Home.displayName = 'Home';
