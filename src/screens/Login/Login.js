/**--external-- */
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**--internal-- */
import { AuthenticationPage } from '../../components';
import { setUserInfoInStorage } from '../../Utils';

/**--relative-- */
import { formFields } from './utils';

const origin = 'http://localhost:4000';

const Login = () => {
  const navigate = useNavigate();
  const submitForm = async (data) => {
    try {
      const res = await fetch(`${origin}/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        referrerPolicy: 'no-referrer',
      });
      const responseData = await res.json();
      const { success, ...userInfo } = responseData;
      if (success) {
        setUserInfoInStorage({ userInfo });
        navigate('/resources');
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
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

export default Login;
Login.displayName = 'Login';
