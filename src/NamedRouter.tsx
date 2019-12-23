import React, { ComponentProps, createContext, JSXElementConstructor } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router';

import { buildRoutingContext, NamedRouteConfig, RoutingContext } from './utils';

export type NamedRouterProps<TRouter extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = {
  routes: NamedRouteConfig[];
  routerComponent?: TRouter;
  routerProps?: ComponentProps<TRouter>;
  children?: React.ReactNode;
}

export const namedRouterContext = createContext<RoutingContext>(buildRoutingContext(
  [],
  { location: '/' },
));

export const NamedRouter = <TRouterProps extends (keyof JSX.IntrinsicElements | JSXElementConstructor<any>)>({
  routerComponent: RouterComponent = (BrowserRouter as any),
  routerProps,
  routes,
  children,
}: NamedRouterProps<TRouterProps>) => (
  <RouterComponent {...(routerProps as any)}>
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
