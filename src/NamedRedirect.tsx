import React from 'react';
import { Redirect, RedirectProps } from 'react-router-dom';

import { useNamedRouting } from './NamedRouter';

export interface NamedRedirectProps<TParams = object> extends RedirectProps {
  to: string;
  params?: TParams;
  children: React.ReactNode;
}

const NamedRedirect = ({
  to,
  params,
  children,
  ...otherProps
}: NamedRedirectProps) => {
  const { getPath } = useNamedRouting();
  return (
    <Redirect {...otherProps} to={getPath(to, params)}>
      {children}
    </Redirect>
  );
};

export default NamedRedirect;
