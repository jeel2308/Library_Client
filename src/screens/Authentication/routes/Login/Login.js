/**--external-- */
import React from 'react';
import { connect } from 'react-redux';
import { Button, Heading, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

/**--internal-- */
import { AuthenticationPage } from '#components';
import { loginUser } from '#modules/Module';

/**--relative-- */
import { formFields } from './utils';

const Login = (props) => {
  const { loginUser } = props;

  const navigate = useNavigate();

  const onCreateAccountClick = () => {
    navigate('/register');
  };

  const onLoginSuccess = ({ showResetPasswordFlow }) => {
    if (!showResetPasswordFlow) {
      navigate('/folders');
    } else {
      navigate('/changePassword');
    }
  };

  const submitForm = async (data) => {
    loginUser(data, onLoginSuccess);
  };

  return (
    <AuthenticationPage
      formFields={formFields}
      submitButtonText="Sign in"
      linkButtonText="Forgot password"
      headerElement={
        <Heading as="h2" size="lg">
          Sign in
        </Heading>
      }
      onSubmit={submitForm}
      linkButtonHref="/resetPassword"
      footerElement={
        <Box textAlign="left">
          <Button
            variant="link"
            colorScheme="blue"
            onClick={onCreateAccountClick}
          >
            Create account
          </Button>
        </Box>
      }
    />
  );
};

const mapActionCreators = {
  loginUser,
};

export default connect(null, mapActionCreators)(Login);
Login.displayName = 'Login';
