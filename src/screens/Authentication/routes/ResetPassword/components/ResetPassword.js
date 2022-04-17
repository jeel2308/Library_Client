/**--external-- */
import React, { useState } from 'react';

/**--internal-- */
import { AuthenticationPage } from '#components';

/**--relative-- */
import { formFields } from './ResetPasswordUtils';

const ResetPassword = () => {
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(true);

  return showResetPasswordForm ? (
    <AuthenticationPage
      formFields={formFields}
      submitButtonText="Reset password"
      linkButtonText="Sign in"
      headingText="Reset password"
      linkButtonHref="/login"
      onSubmit={console.log}
    />
  ) : null;
};

export default ResetPassword;

ResetPassword.displayName = 'ResetPassword';
