import React, { createContext } from 'react';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';
import { Route } from 'react-router';

import { buildRoutingContext, NamedRouteConfig, RoutingContext } from './utils';

export type NamedRouterProps<TRouterProps = BrowserRouterProps> = TRouterProps & {
  routes: NamedRouteConfig[];
  routerComponent?: React.ComponentType<TRouterProps>;
  routerProps?: TRouterProps;
  children?: React.ReactNode;
}

export const namedRouterContext = createContext<RoutingContext>(buildRoutingContext(
  [],
  { location: '/' },
));

export const NamedRouter: React.FC<NamedRouterProps> = ({
  routerComponent: RouterComponent = BrowserRouter,
  routerProps,
  routes,
  children,
}) => (
  <RouterComponent {...routerProps}>
    <Route>
      {(routerContext) => (
        <namedRouterContext.Provider value={buildRoutingContext(routes, routerContext)}>
          {children}
        </namedRouterContext.Provider>
      )}
    </Route>
  </RouterComponent>
);

NamedRouter.displayName = 'NamedRouter';
