import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useNamedRouting } from './hooks';

export interface NamedLinkProps<TParams = object> extends LinkProps {
  to: string;
  params?: TParams;
  children?: React.ReactNode;
}

export const NamedLink: React.FC<NamedLinkProps> = ({
  to,
  params,
  children,
  ...otherProps
}) => {
  const context = useNamedRouting();

  invariant(context, 'You should not use <NamedLink> outside a <NamedRouter>');

  const { getPath } = context;

  return (
    <Link {...otherProps} to={getPath(to, params)}>
      {children}
    </Link>
  );
};

NamedLink.displayName = 'NamedLink';
