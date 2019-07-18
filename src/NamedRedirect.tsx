import React from 'react';
import { Redirect, RedirectProps } from 'react-router-dom';

import { useNamedRouting } from './NamedRouter';

export interface NamedRedirectProps<TParams = object> extends RedirectProps {
  to: string;
  params?: TParams;
}

const NamedRedirect = ({
  to,
  params,
  ...otherProps
}: NamedRedirectProps) => {
  const { getPath } = useNamedRouting();
  return (
    <Redirect {...otherProps} to={getPath(to, params)} />
  );
};

export default NamedRedirect;
