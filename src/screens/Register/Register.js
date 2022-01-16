/**--external-- */
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**--internal-- */
import { AuthenticationPage } from '../../components';

/**--relative-- */
import { formFields } from './utils';

const origin = 'http://localhost:4000';

const Register = () => {
  const navigate = useNavigate();

  const submitForm = async (data) => {
    try {
      const res = await fetch(`${origin}/signup`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        referrerPolicy: 'no-referrer',
      });

      const responseData = await res.json();

      const { success } = responseData;

      if (success) {
        navigate('/login');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthenticationPage
      headingText="Sign up"
      linkButtonText="Sign in"
      submitButtonText="Sign up"
      formFields={formFields}
      onSubmit={submitForm}
      linkButtonHref="/login"
    />
  );
};

Register.displayName = 'Register';

export default Register;
