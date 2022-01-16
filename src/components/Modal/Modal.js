/**--external-- */
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const Modal = ({ children }) => {
  const portalNode = document.getElementById('portal');

  const modalParentNode = document.createElement('div');

  useEffect(() => {
    portalNode.appendChild(modalParentNode);
    return () => portalNode.removeChild(modalParentNode);
  }, []);

  return createPortal(children, modalParentNode);
};

export default Modal;

Modal.propTypes = {
  children: PropTypes.element,
};

Modal.displayName = 'Modal';
