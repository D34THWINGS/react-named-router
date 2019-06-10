import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { useNamedRouting } from './NamedRouter';

export interface NamedLinkProps<TParams = object> extends LinkProps {
  to: string;
  params?: TParams;
  children: React.ReactNode;
}

const NamedLink = ({
  to,
  params,
  children,
  ...otherProps
}: NamedLinkProps) => {
  const { getPath } = useNamedRouting();
  return (
    <Link {...otherProps} to={getPath(to, params)}>
      {children}
    </Link>
  );
};

export default NamedLink;
