/**--external-- */
import React from 'react';
import { connect } from 'react-redux';

/**--internal-- */
import { AuthenticationPage } from '../../components';
import { loginUser } from '../../modules/Module';

/**--relative-- */
import { formFields } from './utils';

const origin = process.env.REACT_APP_SERVER_URL;

const Login = (props) => {
  const { loginUser } = props;

  const submitForm = async (data) => {
    loginUser(data);
  };

  return (
    <AuthenticationPage
      formFields={formFields}
      submitButtonText="Sign in"
      linkButtonText="Create account"
      headingText="Sign in"
      onSubmit={submitForm}
      linkButtonHref="/register"
    />
  );
};

const mapActionCreators = {
  loginUser,
};

export default connect(null, mapActionCreators)(Login);
Login.displayName = 'Login';
