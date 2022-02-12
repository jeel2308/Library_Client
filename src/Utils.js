import _reduceRight from 'lodash/reduceRight';
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

const getToken = () => {
  const { token = '' } = getUserInfoFromStorage() ?? {};
  return `Bearer ${token}`;
};

const clearStorage = () => {
  setUserInfoInStorage({ userInfo: {} });
};

//for POC only, use compose util from Apollo
const compose =
  (...hocArray) =>
  (Component) => {
    return _reduceRight(
      hocArray,
      (WrappedComponent, hoc) => {
        return hoc(WrappedComponent);
      },
      Component
    );
  };

export {
  validateEmail,
  setUserInfoInStorage,
  getUserInfoFromStorage,
  clearStorage,
  getToken,
  compose,
};
