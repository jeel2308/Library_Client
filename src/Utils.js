import _reduceRight from 'lodash/reduceRight';
import _reduce from 'lodash/reduce';
import _keys from 'lodash/keys';
import _filter from 'lodash/filter';

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

//for POC only, use classnames package
const combineClasses = (...classes) => {
  return _reduce(
    classes,
    (allClasses, className) => {
      if (typeof className === 'string') {
        return `${allClasses} ${className}`;
      }
      if (typeof className === 'object') {
        const keys = _keys(className);
        const classNameKey = keys[0];
        const shouldClassNameApply = className[classNameKey];
        if (shouldClassNameApply) {
          return `${allClasses} ${classNameKey}`;
        }
        return allClasses;
      }
      return allClasses;
    },
    ''
  );
};

const getMatchingResults = ({ list, field, searchText }) => {
  const searchRegex = new RegExp(searchText, 'i');
  return _filter(list, (listItem) => {
    const fieldValue = listItem[field];
    return fieldValue.search(searchRegex) > -1;
  });
};

const copyToClipboard = ({ text }) => {
  window.navigator.clipboard.writeText(text);
};

const checkScrollAtBottom = (container) => {
  const { scrollHeight, clientHeight, scrollTop } = container;
  return clientHeight + scrollTop >= scrollHeight;
};

const checkScrollAtTop = (container) => {
  return container.scrollTop === 0;
};

const checkScrollAtRight = (container) => {
  const { scrollWidth, clientWidth, scrollLeft } = container;
  return clientWidth + scrollLeft >= scrollWidth;
};

const checkScrollAtLeft = (container) => {
  return container.scrollLeft === 0;
};

const scrollToBottom = (container) => {
  container.scrollTop = container.scrollHeight - container.clientHeight;
};

const getFieldPresenceStatus = (field) => {
  return field != null && field != undefined;
};

export {
  validateEmail,
  setUserInfoInStorage,
  getUserInfoFromStorage,
  clearStorage,
  getToken,
  compose,
  combineClasses,
  getMatchingResults,
  copyToClipboard,
  checkScrollAtBottom,
  checkScrollAtTop,
  checkScrollAtLeft,
  checkScrollAtRight,
  scrollToBottom,
  getFieldPresenceStatus,
};
