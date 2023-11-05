import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import _get from 'lodash/get';

export const formFields = [
  {
    id: 'link',
    label: 'Resource',
    type: 'url',
    defaultValue: '',
    placeholder: 'link',
    constrains: {
      required: true,
    },
    errorMessages: {
      required: 'url is required!!',
    },
  },
  {
    id: 'isCompleted',
    label: 'mark as completed',
    type: 'checkbox',
  },
  {
    id: 'folderId',
    label: 'Select collection',
    placeholder: 'Select collection',
    type: 'select',
    constrains: {
      required: true,
    },
    errorMessages: {
      required: 'Collection is required!!',
    },
  },
];

export const getDynamicFormFields = ({ formFields, data }) => {
  if (_isEmpty(data)) {
    return formFields;
  }
  return _map(formFields, (field) => {
    const { id } = field;
    let defaultValue;
    let options = [];
    switch (id) {
      case 'link': {
        defaultValue = _get(data, 'url', '');
        break;
      }
      case 'isCompleted': {
        defaultValue = _get(data, 'isCompleted', false);
        break;
      }
      case 'folderId': {
        options = _get(data, 'options', []);
        defaultValue = _get(data, 'folderId', '');
        break;
      }
    }
    return { ...field, defaultValue, options };
  });
};
