/**--external-- */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Heading,
  Box,
  IconButton,
  Text,
  ButtonGroup,
  Link,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { BiX, BiChevronLeft } from 'react-icons/bi';
import GoogleLogin from 'react-google-login';

/**--internal-- */
import { Form, MicrosoftLogin } from '#components';
import { loginUser, setToastMessage } from '#modules/Module';

/**--relative-- */
import { formFields } from './utils';
import { iconStyle, leftIconStyle, textDecorationStyle } from './LoginStyles';

const FormButtons = (props) => {
  const { linkButtonText, submitButtonText, linkButtonHref } = props;
  return (
    <ButtonGroup display="flex" justifyContent="space-between" mt={2}>
      <Link
        to={linkButtonHref}
        display="flex"
        as={RouterLink}
        _hover={textDecorationStyle}
      >
        <Button colorScheme={'blue'} variant="outline">
          {linkButtonText}
        </Button>
      </Link>
      <Button colorScheme={'blue'} type={'submit'}>
        {submitButtonText}
      </Button>
    </ButtonGroup>
  );
};

FormButtons.propTypes = {
  linkButtonHref: PropTypes.string,
  submitButtonText: PropTypes.string,
  linkButtonText: PropTypes.string,
};

FormButtons.displayName = 'FormButtons';

const Login = (props) => {
  const { loginUser, setToastMessage } = props;

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const navigate = useNavigate();

  const onCreateAccountClick = () => {
    navigate('/register');
  };

  const onCloseClick = () => {
    navigate('/');
  };

  const onLoginSuccess = ({ showResetPasswordFlow }) => {
    if (!showResetPasswordFlow) {
      navigate('/folders');
    } else {
      navigate('/changePassword');
    }
  };

  const submitForm = async (data) => {
    const updatedData = { ...data, method: 'local' };
    loginUser(updatedData, onLoginSuccess);
  };

  const goToNextPage = () => {
    setCurrentPageIndex((currentPageIndex) => currentPageIndex + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPageIndex((currentPageIndex) => currentPageIndex - 1);
  };

  const onGoogleLogin = ({ tokenId }) => {
    loginUser({ idToken: tokenId, method: 'google' }, onLoginSuccess);
  };

  const onMicrosoftLogin = ({ accessToken }) => {
    loginUser({ idToken: accessToken, method: 'microsoft' }, onLoginSuccess);
  };

  const onMicrosoftLoginError = (e) => {
    setToastMessage({
      title: 'Error in microsoft sign in',
      status: 'error',
      isClosable: true,
      position: 'bottom-left',
    });
    console.error(e);
  };

  const onGoogleLoginError = (e) => {
    setToastMessage({
      title: 'Error in google sign in',
      status: 'error',
      isClosable: true,
      position: 'bottom-left',
    });
    console.error(e);
  };

  const getCurrentPageElement = () => {
    switch (currentPageIndex) {
      case 0: {
        return (
          <Box display="flex" flexDirection="column" gap={4}>
            <Box display="flex" flexDirection="column" gap={4}>
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                render={({ onClick, disabled }) => {
                  return (
                    <Button
                      onClick={onClick}
                      disabled={disabled}
                      variant="outline"
                      colorScheme="blue"
                    >
                      Google sign in
                    </Button>
                  );
                }}
                onSuccess={onGoogleLogin}
                onFailure={onGoogleLoginError}
                cookiePolicy="single_host_origin"
              />
              <MicrosoftLogin
                onSuccess={onMicrosoftLogin}
                onError={onMicrosoftLoginError}
              >
                {({ onClick }) => (
                  <Button
                    onClick={onClick}
                    variant="outline"
                    colorScheme="blue"
                  >
                    Sign in with microsoft
                  </Button>
                )}
              </MicrosoftLogin>
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={goToNextPage}
              >
                Sign in with email
              </Button>
            </Box>
            <Box display="flex" gap={4} alignItems="center">
              <Box height="1px" backgroundColor="blackAlpha.400" flex={1} />
              <Text>or</Text>
              <Box height="1px" backgroundColor="blackAlpha.400" flex={1} />
            </Box>
            <Box display="flex" flexDirection="column">
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={onCreateAccountClick}
              >
                Create account
              </Button>
            </Box>
          </Box>
        );
      }
      default: {
        return (
          <Box display="flex" flexDirection="column">
            <Form
              fields={formFields}
              onSubmit={submitForm}
              formButtonsElement={
                <FormButtons
                  submitButtonText={'Sign in'}
                  linkButtonText={'Forgot password'}
                  linkButtonHref={'/resetPassword'}
                />
              }
            />
          </Box>
        );
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={4} width="100%">
      <Box display="flex" flexDirection="column" gap={1}>
        {currentPageIndex ? (
          <Box>
            <Button
              variant={'unstyled'}
              onClick={goToPreviousPage}
              fontSize="md"
              height="6"
              display="flex"
              alignItems="center"
              leftIcon={
                <IconContext.Provider value={leftIconStyle}>
                  <BiChevronLeft />
                </IconContext.Provider>
              }
            >
              Back
            </Button>
          </Box>
        ) : null}
        <Box display="flex" justifyContent="space-between">
          <Heading as="h2" size="lg">
            Sign in
          </Heading>
          <IconButton
            variant={'unstyled'}
            onClick={onCloseClick}
            display="flex"
          >
            <IconContext.Provider value={iconStyle}>
              <BiX />
            </IconContext.Provider>
          </IconButton>
        </Box>
      </Box>
      {getCurrentPageElement()}
    </Box>
  );
};

const mapActionCreators = {
  loginUser,
  setToastMessage,
};

export default connect(null, mapActionCreators)(Login);
Login.displayName = 'Login';
