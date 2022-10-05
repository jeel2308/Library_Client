const formFields = [
  {
    id: 'password',
    label: 'New password',
    type: 'password',
    defaultValue: '',
    placeholder: 'Password',
    constrains: {
      required: true,
    },
    errorMessages: {
      required: 'Password is required!!',
    },
    showPasswordStrength: true,
  },
];

export { formFields };
