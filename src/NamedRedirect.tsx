import React from 'react';
import { Redirect, RedirectProps } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useNamedRouting } from './hooks';
import { NamedLocation } from './utils';

export interface NamedRedirectProps<TParams = object> extends RedirectProps {
  to: string | NamedLocation;
  params?: TParams;
}

export const NamedRedirect: React.FC<NamedRedirectProps> = ({
  to,
  params,
  ...otherProps
}) => {
  const context = useNamedRouting();

  invariant(context, 'You should not use <NamedRedirect> outside a <NamedRouter>');

  const { getPath } = context;

  return (
    <Redirect
      {...otherProps}
      to={typeof to === 'string' ? getPath(to, params) : {
        ...to,
        pathname: getPath(to.name, params),
      }}
    />
  );
};

NamedRedirect.displayName = 'NamedRedirect';
