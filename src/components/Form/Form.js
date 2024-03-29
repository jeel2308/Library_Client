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
  Select,
} from '@chakra-ui/react';
import _map from 'lodash/map';

/**--relative-- */
import classes from './Form.module.scss';
import BasicPasswordInput from './BasicPasswordInput';
import PasswordInputWithStrength from './PasswordInputWithStrength';

import { getInitialValues, trimFormFields } from './utils';
const Form = (props) => {
  const { fields, onSubmit, formButtonsElement } = props;

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: getInitialValues({ fields }),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const formSubmitHandler = (value) => {
    const updatedValue = trimFormFields(value);
    onSubmit(updatedValue);
  };

  return (
    <form
      onSubmit={handleSubmit(formSubmitHandler)}
      className={classes.container}
    >
      {fields.map((field) => {
        const {
          id,
          label,
          type,
          placeholder,
          errorMessages,
          constrains,
          options,
          showPasswordStrength,
        } = field;

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

                const onInputChange = (e) => {
                  clearErrors(id);
                  onChange(e);
                };

                const getInputElement = () => {
                  switch (type) {
                    case 'password': {
                      return showPasswordStrength ? (
                        <PasswordInputWithStrength
                          errorMessage={
                            isInvalid ? errorMessages[errorType] : ''
                          }
                          id={id}
                          label={label}
                          value={value}
                          onChange={onInputChange}
                          onBlur={onBlur}
                          placeholder={placeholder}
                        />
                      ) : (
                        <BasicPasswordInput
                          errorMessage={
                            isInvalid ? errorMessages[errorType] : ''
                          }
                          id={id}
                          label={label}
                          value={value}
                          onChange={onInputChange}
                          onBlur={onBlur}
                          placeholder={placeholder}
                        />
                      );
                    }
                    case 'checkbox': {
                      return (
                        <FormControl display="flex" alignItems="center">
                          <Checkbox
                            id={id}
                            isChecked={value}
                            onChange={onInputChange}
                            onBlur={onBlur}
                            size={'lg'}
                          />
                          <FormLabel htmlFor={id} mb={0} fontSize={16} ml={2}>
                            {label}
                          </FormLabel>
                        </FormControl>
                      );
                    }
                    case 'select': {
                      return (
                        <FormControl isInvalid={isInvalid}>
                          <FormLabel htmlFor={id} fontSize={16}>
                            {label}
                          </FormLabel>
                          <Select
                            placeholder="Select collection"
                            onChange={onInputChange}
                            isInvalid={isInvalid}
                            value={value}
                          >
                            {_map(options, (option) => {
                              const { id, label } = option;
                              return (
                                <option value={id} key={id}>
                                  {label}
                                </option>
                              );
                            })}
                          </Select>
                          {isInvalid && (
                            <FormErrorMessage>
                              {errorMessages[errorType]}
                            </FormErrorMessage>
                          )}
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
                            onChange={onInputChange}
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
