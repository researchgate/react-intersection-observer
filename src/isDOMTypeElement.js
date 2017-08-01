import React from 'react';

export default function isDOMTypeElement(element) {
  return React.isValidElement(element) && typeof element.type === 'string';
}
