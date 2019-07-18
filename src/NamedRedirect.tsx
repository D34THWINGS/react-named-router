import React from 'react';
import { Redirect, RedirectProps } from 'react-router-dom';
import invariant from 'tiny-invariant';

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
  const context = useNamedRouting();

  invariant(context, 'You should not use <NamedRedirect> outside a <NamedRouter>');

  const { getPath } = context;

  return (
    <Redirect {...otherProps} to={getPath(to, params)} />
  );
};

export default NamedRedirect;
