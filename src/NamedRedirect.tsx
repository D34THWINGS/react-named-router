import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from 'history';
import { Redirect, RedirectProps } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useNamedRouting } from './hooks';

export interface NamedRedirectProps<TParams = object> extends RedirectProps {
  to: string | (Omit<Partial<Location>, 'pathname'> & { name: string });
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
