/**--external-- */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BiChevronLeft } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import { Button, Avatar, Input, Text } from '@chakra-ui/react';
import { connect } from 'react-redux';
import { get as _get } from 'lodash';

/**--relative-- */
import classes from './Profile.module.scss';
import { backIconStyle } from './ProfileStyles';

const Profile = (props) => {
  const navigate = useNavigate();

  const { name, email } = props;

  const onBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <Button variant="link" onClick={onBackButtonClick} color="black">
          <IconContext.Provider value={backIconStyle}>
            <BiChevronLeft />
          </IconContext.Provider>
          Back
        </Button>
        <Button variant="outline" colorScheme="blue">
          Edit
        </Button>
      </header>
      <main className={classes.userDetailsContainer}>
        <Avatar name={name} size="2xl" />
        <div className={classes.userDetails}>
          <div className={classes.userDetailsItem}>
            <Text mb="3">Name</Text>
            <Input value={name} disabled borderColor="black" color="black" />
          </div>
          <div className={classes.userDetailsItem}>
            <Text mb="3">Email</Text>
            <Input value={email} disabled borderColor="black" color="black" />
          </div>
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = (state) => {
  const userDetails = _get(state, 'userDetails', {});
  return { name: userDetails.name, email: userDetails.email };
};

export default connect(mapStateToProps)(Profile);

Profile.displayName = 'Profile';
