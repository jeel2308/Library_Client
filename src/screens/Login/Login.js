/**--external-- */
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

/**--internal-- */
import { AuthenticationPage } from '../../components';
import { setUserInfoInStorage, AppContext } from '../../Utils';

/**--relative-- */
import { formFields } from './utils';

const origin = 'http://localhost:4000';

const Login = () => {
  const navigate = useNavigate();

  const toast = useToast();

  const { setShowLoader, setUserData } = useContext(AppContext);

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

      res = await fetch(`${origin}/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        referrerPolicy: 'no-referrer',
      });

      responseData = await res.json();

      const { message, ...userInfo } = responseData;

      if (res.ok) {
        setUserInfoInStorage({ userInfo });
        setUserData(userInfo);
        navigate('/resources');
      } else {
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
