/**--external-- */
import React from 'react';

/**--internal-- */
import { AuthenticationPage } from '../../components';

/**--relative-- */
import { formFields } from './utils';

const Login = () => {
  return (
    <AuthenticationPage
      formFields={formFields}
      submitButtonText="Sign in"
      linkButtonText="Create account"
      headingText="Sign in"
      onSubmit={(data) => console.log(data)}
      linkButtonHref="/register"
    />
  );
};

export default Login;
Login.displayName = 'Login';
