import React, { createContext, useContext, useMemo } from 'react';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';
import { __RouterContext } from 'react-router';
/* eslint-disable import/no-extraneous-dependencies */
import { RouteConfig } from 'react-router-config';
import { History } from 'history';
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
  history?: History;
  children?: React.ReactNode;
}

export const routerContext = createContext<BaseRoutingContext | RoutingContext>(buildRoutingContext([]));
export const useNamedRouting = () => useContext(routerContext);

const NamedRouter = ({
  routerComponent: RouterComponent = BrowserRouter,
  routerProps,
  routes,
  history,
  children,
}: NamedRouterProps) => {
  const { history: routerHistory } = useContext(__RouterContext);
  const routingContext = useMemo(() => buildRoutingContext(routes, history || routerHistory), [routes]);
  return (
    <RouterComponent {...routerProps}>
      <routerContext.Provider value={routingContext}>
        {children}
      </routerContext.Provider>
    </RouterComponent>
  );
};

export default NamedRouter;
