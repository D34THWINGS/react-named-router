import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

import { useNamedRouting } from './NamedRouter';

export interface NamedRouteProps<TParams = object> extends RouteProps {
  name: string;
  children?: React.ReactNode;
}

const NamedRoute = ({
  name,
  children,
  ...otherProps
}: NamedRouteProps) => {
  const { getRoute } = useNamedRouting();
  return (
    <Route {...otherProps} path={getRoute(name).path}>
      {children}
    </Route>
  );
};

export default NamedRoute;
