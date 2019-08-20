import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useNamedRouting } from './hooks';
import { NamedLocation } from './utils';

export interface NamedLinkProps<TParams = object> extends LinkProps {
  to: string | NamedLocation;
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
    <Link
      {...otherProps}
      to={typeof to === 'string' ? getPath(to, params) : {
        ...to,
        pathname: getPath(to.name, params),
      }}
    >
      {children}
    </Link>
  );
};

NamedLink.displayName = 'NamedLink';
