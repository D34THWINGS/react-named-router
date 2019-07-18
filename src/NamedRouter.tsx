import React, { createContext, useContext } from 'react';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';
import { Route } from 'react-router';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from 'history';

import { BaseRoutingContext, buildRoutingContext, RoutingContext } from './utils';

export type NamedRouteConfig<T = object> = T & {
  name?: string;
  path?: string;
  title?: string;
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

const NamedRouter = ({
  routerComponent: RouterComponent = BrowserRouter,
  routerProps,
  routes,
  children,
}: NamedRouterProps) => (
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

export default NamedRouter;
