import React, { createContext, useContext } from 'react';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';
import { Route } from 'react-router';
/* eslint-disable import/no-extraneous-dependencies */
import { RouteConfig } from 'react-router-config';
/* eslint-enable */

import { BaseRoutingContext, buildRoutingContext, RoutingContext } from './utils';

export interface NamedRouteConfig extends RouteConfig {
  name?: string;
  title?: string;
  routes?: NamedRouteConfig[];
}

export interface NamedRouterProps<TRouterProps = BrowserRouterProps> {
  routes: NamedRouteConfig[];
  routerComponent?: React.ComponentType<TRouterProps>;
  routerProps?: TRouterProps;
  children?: React.ReactNode;
}

export const routerContext = createContext<BaseRoutingContext | RoutingContext>(buildRoutingContext([]));
export const useNamedRouting = () => useContext(routerContext);

const NamedRouter = ({
  routerComponent: RouterComponent = BrowserRouter,
  routerProps,
  routes,
  children,
}: NamedRouterProps) => (
  <RouterComponent {...routerProps}>
    <Route>
      {({ history }) => (
        <routerContext.Provider value={buildRoutingContext(routes, history)}>
          {children}
        </routerContext.Provider>
      )}
    </Route>
  </RouterComponent>
);

export default NamedRouter;
