/**--external-- */
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

/**--internal-- */
import { AuthenticationPage } from '../../components';
import { AppContext } from '../../Utils';

/**--relative-- */
import { formFields } from './utils';

const origin = 'http://localhost:4000';

const Register = () => {
  const navigate = useNavigate();

  const toast = useToast();

  const { setShowLoader } = useContext(AppContext);

  const generateToast = ({ message }) => {
    toast({
      title: message,
      status: 'error',
      isClosable: true,
      position: 'bottom-left',
    });
  };

  const submitForm = async (data) => {
    let responseData = {};

    let res = {};

    try {
      setShowLoader(true);
      res = await fetch(`${origin}/signup`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        referrerPolicy: 'no-referrer',
      });

      /**
       * If res status is ok(status is 200) then we will do redirection
       */
      if (res.ok) {
        navigate('/login');
      } else {
        /**
         * Fetch api throws error only when network error occur.
         * For status 4xx and 5xx, we have to add logic for toast in try block
         */
        responseData = await res.json();

        const { message } = responseData;

        /**
         * If there is message from backend then we will use it otherwise we use
         * default failure message from res obj.
         */
        generateToast({ message: message || res.statusText });
      }
    } catch (e) {
      generateToast({ message: 'Something went wrong' });
    } finally {
      setShowLoader(false);
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
