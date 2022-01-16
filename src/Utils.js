const validateEmail = (email) => {
  const emailRegex = new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, 'i');

  return emailRegex.test(email);
};

export { validateEmail };
