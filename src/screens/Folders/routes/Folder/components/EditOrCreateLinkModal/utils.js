import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import _get from 'lodash/get';

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

export const getDynamicFormFields = ({ formFields, data }) => {
  if (_isEmpty(data)) {
    return formFields;
  }
  return _map(formFields, (field) => {
    const { id } = field;
    let defaultValue;
    switch (id) {
      case 'link': {
        defaultValue = _get(data, 'url', '');
        break;
      }
      case 'isCompleted': {
        defaultValue = _get(data, 'isCompleted', false);
        break;
      }
    }
    return { ...field, defaultValue };
  });
};
