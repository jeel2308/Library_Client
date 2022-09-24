/**--external-- */
import React from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button, IconButton, Box } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { BiX } from 'react-icons/bi';
import { IconContext } from 'react-icons';

/**--relative-- */
import Form from '../Form';
import classes from './AuthenticationPage.module.scss';
import {
  buttonGroupStyle,
  linkStyle,
  iconStyle,
} from './AuthenticationPageStyles';

const FormButtons = (props) => {
  const { linkButtonText, submitButtonText, linkButtonHref } = props;
  return (
    <ButtonGroup style={buttonGroupStyle}>
      <Link to={linkButtonHref} style={linkStyle}>
        <Button colorScheme={'blue'} variant={'link'}>
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

const AuthenticationPage = (props) => {
  const {
    submitButtonText,
    linkButtonText,
    headerElement,
    formFields,
    onSubmit,
    linkButtonHref,
    footerElement,
  } = props;

  const navigate = useNavigate();

  const onCloseClick = () => {
    navigate('/');
  };

  return (
    <div className={classes.container}>
      <Box display="flex" justifyContent="space-between">
        {headerElement}
        <IconButton variant={'unstyled'} onClick={onCloseClick} display="flex">
          <IconContext.Provider value={iconStyle}>
            <BiX />
          </IconContext.Provider>
        </IconButton>
      </Box>
      <Form
        fields={formFields}
        onSubmit={onSubmit}
        formButtonsElement={
          <FormButtons
            submitButtonText={submitButtonText}
            linkButtonText={linkButtonText}
            linkButtonHref={linkButtonHref}
          />
        }
      />
      {footerElement}
    </div>
  );
};

export default AuthenticationPage;

AuthenticationPage.propTypes = {
  submitButtonText: PropTypes.string,
  linkButtonText: PropTypes.string,
  headerElement: PropTypes.element.isRequired,
  formFields: PropTypes.array,
  onSubmit: PropTypes.func,
  linkButtonHref: PropTypes.string,
  footerElement: PropTypes.element,
};

AuthenticationPage.defaultProps = {
  footerElement: null,
};

AuthenticationPage.displayName = 'AuthenticationPage';
