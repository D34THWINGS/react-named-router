import { matchPath, RouteChildrenProps } from 'react-router';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LocationDescriptorObject } from 'history';
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
    // Remove trailing slash only if URL is not just a /
    .replace(/^(.+)\/$/, '$1'));

export const mapRoutes = (
  routes: NamedRouteConfig[],
  basename: string = '',
  parents: string[] = [],
  map: Map<string, ExtendedRouteConfig> = new Map(),
) => {
  routes.forEach((route) => {
    if (route.routes) {
      mapRoutes(
        route.routes,
        basename,
        route.name ? [...parents, Array.isArray(route.name) ? route.name[0] : route.name] : parents,
        map,
      );
    }

    if (!route.name && route.path) {
      throw new Error(`Route ${route.path} has no name`);
    }

    if (!route.name) {
      return;
    }

    const existingRoute = Array.isArray(route.name)
      ? map.get(route.name.find(name => map.get(name)) || '')
      : map.get(route.name);
    if (process.env.NODE_ENV !== 'production' && existingRoute) {
      // eslint-disable-next-line no-console
      console.warn(`Duplicate definition for route ${route.name}:\n- ${existingRoute.path}\n- ${route.path}`);
    }

    (Array.isArray(route.name) ? route.name : [route.name]).forEach(name => map.set(name, {
      ...route,
      parents,
      ...(route.path ? {
        regex: new RegExp(
          `^${(basename + route.path)
            .replace(/\/:\w+\?/g, '/?([^\\/]*)')
            .replace(/:\w+/g, '([^\\/]+)')}\\/?${route.exact ? '$' : ''}`,
        ),
      } : {}),
    }));
  });

  return map;
};

const omitName = ({ name, ...rest }: NamedLocation) => rest;

export type NamedLocation = Omit<LocationDescriptorObject, 'pathname'> & {
  name: string;
}

const defaultParams = {};

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

  public get params(): { [key: string]: string } {
    const route = this.match(this.location.pathname);
    if (!route || !route.path) {
      return defaultParams;
    }
    const match = matchPath(this.location.pathname, route);
    return match ? match.params : defaultParams;
  }

  public get currentRoute() {
    return this.match(this.location.pathname);
  }

  public constructor(
    routesMap: Map<string, ExtendedRouteConfig>,
    routerContext: RouteChildrenPropsWithLocation,
  ) {
    this.routesMap = routesMap;
    this.routerContext = routerContext;
  }

  public match = (pathname: string, matchAll?: boolean) => Array.from(this.routesMap.values())
    .find(route => (matchAll || (!matchAll && route.exact)) && !!route.regex && route.regex.test(pathname)) || null;

  public getPath = <TParams>(name: string, params?: TParams) => buildRoutePath(this.routesMap, name, params);

  public getRawPath = (name: string) => buildRawPath(this.routesMap, name);

  public getRoute = (name: string) => {
    const route = this.routesMap.get(name);
    if (!route) {
      throw new Error(`Undefined route "${name}"`);
    }
    return route;
  };

  public push = (location: string | NamedLocation, params?: { [key: string]: string }) => this.history.push({
    pathname: buildRoutePath(this.routesMap, typeof location === 'string' ? location : location.name, params),
    ...(typeof location === 'string' ? undefined : omitName(location)),
  });

  public replace = (location: string | NamedLocation, params?: { [key: string]: string }) => this.history.replace({
    pathname: buildRoutePath(this.routesMap, typeof location === 'string' ? location : location.name, params),
    ...(typeof location === 'string' ? undefined : omitName(location)),
  });
}

export type RoutingContextArg = Omit<Partial<RouteChildrenProps<any, any>>, 'location'> & {
  location: string | RouteChildrenProps<any, any>['location'];
}

export const buildRoutingContext = (
  routes: NamedRouteConfig[],
  routerContext: RoutingContextArg,
  basename?: string,
): RoutingContext => {
  const map = mapRoutes(routes, basename);

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
