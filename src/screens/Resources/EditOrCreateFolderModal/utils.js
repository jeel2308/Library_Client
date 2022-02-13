export const formFields = [
  {
    id: 'folder',
    label: 'Folder name',
    type: 'text',
    defaultValue: '',
    placeholder: 'folder',
    constrains: {
      required: true,
    },
    errorMessages: {
      required: 'Name is required!!',
    },
  },
];
