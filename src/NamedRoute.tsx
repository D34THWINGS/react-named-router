import React from 'react';
import { RouteChildrenProps } from 'react-router';
import { Route, RouteProps } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { NamedRouteConfig } from './NamedRouter';
import { useNamedRouting } from './hooks';

interface AnyOtherProp { [key: string]: any }

export interface NamedRouteProps extends Omit<RouteProps, 'path'>, AnyOtherProp {
  name: string;
  children?: React.ReactNode;
}

export interface NamedRouteComponentProps extends RouteChildrenProps {
  route: NamedRouteConfig;
}

export const NamedRoute: React.FC<NamedRouteProps> = ({
  name,
  children,
  ...otherProps
}) => {
  const context = useNamedRouting();

  invariant(context, 'You should not use <NamedRoute> outside a <NamedRouter>');

  const route = context.getRoute(name);

  return (
    <Route {...route} {...otherProps}>
      {children}
    </Route>
  );
};

NamedRoute.displayName = 'NamedRoute';
