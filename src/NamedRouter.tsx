import React, { createContext, useContext } from 'react';
import { BrowserRouter, BrowserRouterProps, RouteProps } from 'react-router-dom';
import { Route } from 'react-router';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from 'history';

import { BaseRoutingContext, buildRoutingContext, RoutingContext } from './utils';

export type NamedRouteConfig<T = { [key: string]: any }> = T & Omit<RouteProps, 'children'> & {
  name?: string;
  path?: string;
  routes?: NamedRouteConfig<T>[];
}

export type NamedRouterProps<TRouterProps = BrowserRouterProps> = TRouterProps & {
  routes: NamedRouteConfig[];
  routerComponent?: React.ComponentType<TRouterProps>;
  routerProps?: TRouterProps;
  children?: React.ReactNode;
}

export const routerContext = createContext<BaseRoutingContext | RoutingContext>(buildRoutingContext(
  [],
  {} as unknown as Location,
));
export const useNamedRouting = () => useContext(routerContext);

export const NamedRouter: React.FC<NamedRouterProps> = ({
  routerComponent: RouterComponent = BrowserRouter,
  routerProps,
  routes,
  children,
}) => (
  <RouterComponent {...routerProps}>
    <Route>
      {({ history, location }) => (
        <routerContext.Provider value={buildRoutingContext(routes, location, history)}>
          {children}
        </routerContext.Provider>
      )}
    </Route>
  </RouterComponent>
);

NamedRouter.displayName = 'NamedRouter';
