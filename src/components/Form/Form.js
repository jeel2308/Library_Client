/**--external-- */
import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import {
  Input,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';

/**--relative-- */
import classes from './Form.module.scss';
import PasswordInput from './PasswordInput';
import { getInitialValues } from './utils';
const Form = (props) => {
  const { fields, onSubmit, formButtonsElement } = props;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: getInitialValues({ fields }),
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.container}>
      {fields.map((field) => {
        const { id, label, type, placeholder, errorMessages, constrains } =
          field;

        const errorType = errors?.[id]?.type ?? 'required';

        return (
          <div key={id} className={classes.field}>
            <Controller
              name={id}
              control={control}
              rules={constrains}
              render={({ field, fieldState }) => {
                const { value, onChange, onBlur } = field;
                const { invalid: isInvalid } = fieldState;

                const getInputElement = () => {
                  switch (type) {
                    case 'password': {
                      return (
                        <FormControl isInvalid={isInvalid}>
                          <FormLabel htmlFor={id} fontSize={16}>
                            {label}
                          </FormLabel>
                          <PasswordInput
                            id={id}
                            borderColor={'blackAlpha.500'}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            size={'md'}
                          />
                          {isInvalid && (
                            <FormErrorMessage>
                              {errorMessages[errorType]}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      );
                    }
                    case 'checkbox': {
                      return (
                        <FormControl display="flex" alignItems="center">
                          <Checkbox
                            id={id}
                            isChecked={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            size={'lg'}
                          />
                          <FormLabel htmlFor={id} mb={0} fontSize={16} ml={2}>
                            {label}
                          </FormLabel>
                        </FormControl>
                      );
                    }
                    default: {
                      return (
                        <FormControl isInvalid={isInvalid}>
                          <FormLabel htmlFor={id} fontSize={16}>
                            {label}
                          </FormLabel>
                          <Input
                            id={id}
                            borderColor={'blackAlpha.500'}
                            type={type}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            size={'md'}
                          />
                          {isInvalid && (
                            <FormErrorMessage>
                              {errorMessages[errorType]}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      );
                    }
                  }
                };

                return <React.Fragment>{getInputElement()}</React.Fragment>;
              }}
            />
          </div>
        );
      })}
      {formButtonsElement}
    </form>
  );
};

export default Form;

Form.displayName = 'Form';

Form.propTypes = {
  fields: PropTypes.array,
  onSubmit: PropTypes.func,
  formButtonsElement: PropTypes.element,
};
