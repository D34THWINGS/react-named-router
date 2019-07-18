import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useNamedRouting } from './NamedRouter';

export interface NamedRouteProps<TParams = object> extends Omit<RouteProps, 'path'> {
  name: string;
  children?: React.ReactNode;
}

const NamedRoute = ({
  name,
  children,
  ...otherProps
}: NamedRouteProps) => {
  const context = useNamedRouting();

  invariant(context, 'You should not use <NamedRoute> outside a <NamedRouter>');

  const { getRoute } = context;

  return (
    <Route {...otherProps} path={getRoute(name).path}>
      {children}
    </Route>
  );
};

export default NamedRoute;
