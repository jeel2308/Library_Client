/**--external-- */
import React from 'react';
import Proptypes from 'prop-types';
import { PublicClientApplication } from '@azure/msal-browser';

const MicrosoftLogin = (props) => {
  const { onError, onSuccess, children } = props;
  const publicClientApplication = new PublicClientApplication({
    auth: {
      clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID,
    },
  });

  const openLoginPopup = async () => {
    try {
      const res = await publicClientApplication.loginPopup({
        scopes: ['user.read'],
        prompt: 'select_account',
      });
      onSuccess(res);
    } catch (e) {
      onError(e);
    }
  };

  return children({ onClick: openLoginPopup });
};

export default MicrosoftLogin;
MicrosoftLogin.displayName = 'MicrosoftLogin';

MicrosoftLogin.propTypes = {
  onError: Proptypes.func.isRequired,
  onSuccess: Proptypes.func.isRequired,
  children: Proptypes.func.isRequired,
};
