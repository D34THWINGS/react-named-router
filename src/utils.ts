import { RouteChildrenProps } from 'react-router';
import { NamedRouteConfig } from './NamedRouter';

export interface ExtendedRouteConfig extends NamedRouteConfig {
  parents: string[];
  regex?: RegExp;
}

type RouteChildrenPropsWithLocation = Omit<Partial<RouteChildrenProps<any, any>>, 'location'> & {
  location: RouteChildrenProps<any, any>['location'];
}

const buildRawPath = (map: Map<string, ExtendedRouteConfig>, name: string) => {
  const route = map.get(name);
  if (!route) {
    throw new Error(`Undefined route "${name}"`);
  }
  if (!route.path) {
    throw new Error(`Route "${name}" does not have a path`);
  }
  return route.path;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildRoutePath = (map: Map<string, ExtendedRouteConfig>, name: string, params: any = {}) => (
  buildRawPath(map, name)
    .replace(/:\w+\??/g, (match) => {
      const paramKey = match.replace(/[:?]/g, '');
      const paramValue = params[paramKey];
      if (!paramValue && !match.includes('?')) {
        throw new Error(`Missing value for required param "${paramKey}"`);
      }
      return paramValue || '';
    })
    .replace(/\/$/, ''));

export const mapRoutes = (
  routes: NamedRouteConfig[],
  parents: string[] = [],
  map: Map<string, ExtendedRouteConfig> = new Map(),
) => {
  routes.forEach((route) => {
    if (route.routes) {
      mapRoutes(route.routes, route.name ? [...parents, route.name] : parents, map);
    }

    if (!route.name && route.path) {
      throw new Error(`Route ${route.path} has no name`);
    }

    if (!route.name) {
      return;
    }

    const existingRoute = map.get(route.name);
    if (process.env.NODE_ENV !== 'production' && existingRoute) {
      // eslint-disable-next-line no-console
      console.warn(`Duplicate definition for route ${route.name}:\n- ${existingRoute.path}\n- ${route.path}`);
    }

    map.set(route.name, {
      ...route,
      parents,
      ...(route.path ? {
        regex: new RegExp(
          `^${route.path.replace(/\/:\w+\?/g, '/?([\\w_-]*)').replace(/:\w+/g, '([\\w_-]+)')}\\/?$`,
        ),
      } : {}),
    });
  });

  return map;
};

export class RoutingContext {
  protected readonly routesMap: Map<string, ExtendedRouteConfig>;

  protected routerContext: RouteChildrenPropsWithLocation;

  public get location() {
    return this.routerContext.location;
  }

  public get history() {
    if (!this.routerContext.history) {
      throw new Error('History API cannot be used on server side');
    }

    return this.routerContext.history;
  }

  public get params() {
    return this.routerContext.match ? this.routerContext.match.params : {};
  }

  public constructor(
    routesMap: Map<string, ExtendedRouteConfig>,
    routerContext: RouteChildrenPropsWithLocation,
  ) {
    this.routesMap = routesMap;
    this.routerContext = routerContext;
  }

  public match = (pathname: string) => Array.from(this.routesMap.values())
    .find(route => !!route.regex && route.regex.test(pathname)) || null;

  public getPath = <TParams>(name: string, params?: TParams) => buildRoutePath(this.routesMap, name, params);

  public getRawPath = (name: string) => buildRawPath(this.routesMap, name);

  public getRoute = (name: string) => {
    const route = this.routesMap.get(name);
    if (!route) {
      throw new Error(`Undefined route "${name}"`);
    }
    return route;
  };

  public push = <TParams>(name: string, params?: TParams) => this.history
    .push(buildRoutePath(this.routesMap, name, params));

  public replace = <TParams>(name: string, params?: TParams) => this.history
    .replace(buildRoutePath(this.routesMap, name, params));
}

export const buildRoutingContext = (
  routes: NamedRouteConfig[],
  routerContext: Omit<Partial<RouteChildrenProps<any, any>>, 'location'> & {
    location: string | RouteChildrenProps<any, any>['location'];
  },
): RoutingContext => {
  const map = mapRoutes(routes);

  let finalContext = routerContext;
  if (typeof routerContext.location === 'string') {
    const [pathname, search] = routerContext.location.split('?');
    finalContext = {
      ...routerContext,
      location: {
        pathname,
        search: search ? `?${search}` : '',
        state: {},
        hash: '',
      },
    };
  }

  return new RoutingContext(map, finalContext as RouteChildrenPropsWithLocation);
};
