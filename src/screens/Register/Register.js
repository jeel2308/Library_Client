/**--external-- */
import React from 'react';

/**--internal-- */
import { AuthenticationPage } from '../../components';

/**--relative-- */
import { formFields } from './utils';

const Register = () => {
  return (
    <AuthenticationPage
      headingText="Sign up"
      linkButtonText="Sign in"
      submitButtonText="Sign up"
      formFields={formFields}
      onSubmit={(data) => console.log(data)}
      linkButtonHref="/login"
    />
  );
};

Register.displayName = 'Register';

export default Register;
