const validateEmail = (email) => {
  const emailRegex = new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, 'i');

  return emailRegex.test(email);
};

const setUserInfoInStorage = ({ userInfo }) => {
  localStorage.setItem(`library-user`, JSON.stringify(userInfo));
};

const getUserInfoFromStorage = () => {
  const data = localStorage.getItem(`library-user`);
  try {
    return JSON.parse(data);
  } catch (e) {
    console.log(e);
    return {};
  }
};

const clearStorage = () => {
  setUserInfoInStorage({ userInfo: {} });
};

export {
  validateEmail,
  setUserInfoInStorage,
  getUserInfoFromStorage,
  clearStorage,
};
