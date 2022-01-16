export const getInitialValues = ({ fields }) => {
  return fields.reduce((result, { defaultValue, id }) => {
    return { ...result, [id]: defaultValue };
  }, {});
};
