/**--external-- */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@chakra-ui/react';
import { connect } from 'react-redux';

/**--internal-- */
import { AuthenticationPage } from '#components';
import { registerUser } from '#modules/Module';

/**--relative-- */
import { formFields } from './utils';

const Register = (props) => {
  const { registerUser } = props;
  const navigate = useNavigate();

  const onSubmit = (data) => {
    registerUser(data, () => navigate('/login'));
  };

  return (
    <AuthenticationPage
      linkButtonText="Sign in"
      submitButtonText="Register"
      formFields={formFields}
      onSubmit={onSubmit}
      linkButtonHref="/login"
      headerElement={
        <Heading as="h2" size="lg">
          Create account
        </Heading>
      }
    />
  );
};

Register.displayName = 'Register';
const mapActionCreators = {
  registerUser,
};

export default connect(null, mapActionCreators)(Register);
