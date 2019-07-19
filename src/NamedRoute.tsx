import React from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { NamedRouteConfig, useNamedRouting } from './NamedRouter';

export interface NamedRouteProps<TParams = object> extends Omit<RouteProps, 'path'> {
  name: string;
  children?: React.ReactNode;
}

export interface NamedRouteComponentProps<P, C, S> extends RouteComponentProps<P, C, S> {
  route: NamedRouteConfig;
}

const NamedRoute = ({
  name,
  children,
  ...otherProps
}: NamedRouteProps) => {
  const context = useNamedRouting();

  invariant(context, 'You should not use <NamedRoute> outside a <NamedRouter>');

  const route = context.getRoute(name);

  return (
    <Route {...route} {...otherProps}>
      {children}
    </Route>
  );
};

export default NamedRoute;
