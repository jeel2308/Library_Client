/**--external-- */
import React from 'react';

/**--internal-- */
import { AuthenticationPage } from '#components';

/**--relative-- */
import { formFields } from './ChangePasswordUtils';

const ChangePassword = () => {
  return (
    <AuthenticationPage
      formFields={formFields}
      submitButtonText="Change password"
      linkButtonText="Sign in"
      linkButtonHref="/login"
      onSubmit={console.log}
      headingText="Change password"
    />
  );
};

export default ChangePassword;

ChangePassword.displayName = 'ChangePassword';
