import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useNamedRouting } from './NamedRouter';

export interface NamedLinkProps<TParams = object> extends LinkProps {
  to: string;
  params?: TParams;
  children?: React.ReactNode;
}

const NamedLink = ({
  to,
  params,
  children,
  ...otherProps
}: NamedLinkProps) => {
  const context = useNamedRouting();

  invariant(context, 'You should not use <NamedLink> outside a <NamedRouter>');

  const { getPath } = context;

  return (
    <Link {...otherProps} to={getPath(to, params)}>
      {children}
    </Link>
  );
};

export default NamedLink;
