/**--external-- */
import React, { useRef, useEffect } from 'react';
import propTypes from 'prop-types';

/**--internal-- */
import { mergeRefs } from '#Utils';

const ScrollIntoViewWrapper = (props) => {
  const { dependencyForChangingScrollPosition, children } = props;

  const childrenRef = useRef(null);

  const updateRefs = (node) =>
    mergeRefs({ node, refs: [childrenRef, children.ref] });

  useEffect(() => {
    childrenRef.current.scrollIntoView({ bahavior: 'smooth' });
  }, dependencyForChangingScrollPosition);

  return React.cloneElement(children, { ref: updateRefs });
};

export default ScrollIntoViewWrapper;

ScrollIntoViewWrapper.displayName = 'ScrollIntoViewWrapper';

ScrollIntoViewWrapper.propTypes = {
  dependencyForChangingScrollPosition: propTypes.array,
};
