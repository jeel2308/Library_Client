/**--external-- */
import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { Input, Text } from '@chakra-ui/react';

/**--relative-- */
import './Form.css';
import { getInitialValues } from './utils';
const Form = (props) => {
  const { fields, onSubmit, formButtonsElement } = props;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: getInitialValues({ fields }),
    mode: 'all',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      {fields.map((field) => {
        const { id, label, type, placeholder, errorMessages, constrains } =
          field;

        const errorType = errors?.[id]?.type ?? 'required';

        return (
          <div key={id} className="form-field">
            <Text mb="8px">{label}</Text>
            <Controller
              name={id}
              control={control}
              rules={constrains}
              render={({ field, fieldState }) => {
                const { value, onChange, onBlur } = field;
                const { invalid: isInvalid } = fieldState;

                return (
                  <React.Fragment>
                    <Input
                      borderColor={'blackAlpha.500'}
                      errorBorderColor={'crimson'}
                      isInvalid={isInvalid}
                      type={type}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      placeholder={placeholder}
                      size={'md'}
                    />

                    {isInvalid && (
                      <div className="field-error">
                        {errorMessages[errorType]}
                      </div>
                    )}
                  </React.Fragment>
                );
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
