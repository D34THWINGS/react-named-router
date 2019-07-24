// eslint-disable-next-line import/no-extraneous-dependencies
import { History, Location } from 'history';

import { NamedRouteConfig } from './NamedRouter';

export interface ExtendedRouteConfig extends NamedRouteConfig {
  parents: string[];
  regex?: RegExp;
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

export class BaseRoutingContext {
  protected readonly routesMap: Map<string, ExtendedRouteConfig>;

  public location: Location | null = null;

  public constructor(routesMap: Map<string, ExtendedRouteConfig>) {
    this.routesMap = routesMap;
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
  }
}

export class RoutingContext extends BaseRoutingContext {
  protected history: History;

  public constructor(routesMap: Map<string, ExtendedRouteConfig>, history: History) {
    super(routesMap);

    this.history = history;
  }

  public push = <TParams>(name: string, params?: TParams) => this.history
    .push(buildRoutePath(this.routesMap, name, params));

  public replace = <TParams>(name: string, params?: TParams) => this.history
    .replace(buildRoutePath(this.routesMap, name, params));
}

/* eslint-disable import/export */
export function buildRoutingContext(
  routes: NamedRouteConfig[],
  location?: Location | string | null,
): BaseRoutingContext;
export function buildRoutingContext(
  routes: NamedRouteConfig[],
  location?: Location | string | null,
  history?: History
): RoutingContext;
export function buildRoutingContext(
  routes: NamedRouteConfig[],
  location?: Location | string | null,
  history?: History,
): BaseRoutingContext | RoutingContext {
  const map = mapRoutes(routes);

  const context = history ? new RoutingContext(map, history) : new BaseRoutingContext(map);
  if (location) {
    context.location = typeof location === 'string' ? {
      pathname: location,
      search: '',
      state: {},
      hash: '',
    } : location;
  }

  return context;
}
/* eslint-enable import/export */
