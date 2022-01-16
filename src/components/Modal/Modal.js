/**--external-- */
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const Modal = ({ children }) => {
  const portalNode = document.getElementById('portal');

  const modalParentNodeRef = useRef(document.createElement('div'));

  useEffect(() => {
    const modalParentNode = modalParentNodeRef.current;
    portalNode.appendChild(modalParentNode);
    return () => portalNode.removeChild(modalParentNode);
  }, []);

  return createPortal(children, modalParentNodeRef.current);
};

export default Modal;

Modal.propTypes = {
  children: PropTypes.element,
};

Modal.displayName = 'Modal';
