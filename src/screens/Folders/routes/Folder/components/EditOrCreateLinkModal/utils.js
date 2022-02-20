export const formFields = [
  {
    id: 'link',
    label: 'Link',
    type: 'url',
    defaultValue: '',
    placeholder: 'link',
    constrains: {
      required: true,
    },
    errorMessages: {
      required: 'link is required!!',
    },
  },
  {
    id: 'isCompleted',
    label: 'mark as completed',
    type: 'checkbox',
  },
];
