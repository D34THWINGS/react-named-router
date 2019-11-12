# react-named-router
[![Travis](https://img.shields.io/travis/D34THWINGS/react-named-router.svg)](https://travis-ci.org/D34THWINGS/react-named-router)
[![NPM Version](https://img.shields.io/npm/v/react-named-router.svg)](https://www.npmjs.com/package/react-named-router)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Named router built on top of [React Router](https://github.com/ReactTraining/react-router).
Allows you to control your urls more efficiently by abstracting them away from your application.
Makes translation and parameterized url building easier. Fully compatible with
[react-router-config](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config). It
can also be used on server side rendering.

:warning: This package is based on `react-router-dom` components and is required as a peer dependency, therefore, you
can't use it (yet) on Native environment.

* [Installation](#installation)
* [Usage](#usage)
* [Advanced usage](#advanced-usage)
* [Configuration first usage](#configuration-first-usage)
* [With react-router-config](#with-react-router-config)
* [I18n (translated route paths)](#i18n-translated-route-paths)
* [SSR](#ssr)
* [API](#api)
  * [NamedRouter](#namedrouter)
  * [NamedLink](#namedlink)
  * [NamedRedirect](#namedredirect)
  * [NamedRoute](#namedroute-1)
  * [NamedSwitch](#namedswitch-1)
  * [Context API](#context-api)
* [Contribute](#contribute)

## Installation

Using [yarn](https://yarnpkg.com/):

```shell
$ yarn add react-named-router react-router-dom
```

Using [npm](https://www.npmjs.com/):

```shell
$ npm install --save react-named-router react-router-dom
```

That's it ! You don't need anything more.

## Usage

The basic setup example:

```jsx harmony
import React from 'react';
import { NamedRouter } from 'react-named-router';

const routes = [
  { name: 'home', path: '/' },
  { name: 'parent', path: '/parent', routes: [{ name: 'nested', path: '/parent/nested' }] },
  { name: 'parametrized', path: '/users/:userId' },
  { name: 'optional', path: '/tasks/:type?' },
];

const App = () => (
  <NamedRouter routes={routes}>
    {/* App content goes here */}
  </NamedRouter>
);

export default App;
```

The routes configuration is relying on the same structure as `react-router-config` and can be used for both naming and
route rendering via `renderRoutes(route.routes)` (see [documentation](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config#matchroutesroutes-pathname) for more details).

Nesting routes is not mandatory and only helps on two cases:

- When you want to do certain things when a component has a certain route in its parents route.
- When you use `renderRoutes` from `react-router-config`.

By default, `NamedRouter` is using `BrowserRouter` under the hood but you can change that through the `routerComponent`
prop.

### `NamedRoute`

The basic component to render routing is the same as when you use React Router classic. The only difference is that it
will take a `name` prop instead of `path`.

```jsx harmony
import { NamedRoute, NamedSwitch } from 'react-named-router';

const MyComponent = () => (
  <div className="wrapper">
    <NamedSwitch>
      <NamedRoute name="home" exact component={Home} />
      <Route component={NotFound} />
    </NamedSwitch>
  </div>
);
```

The `NamedRoute` component will throw an error if requested route does not exist. This will help ensuring that your app
uses only valid route names.

### `NamedLink` and `NamedRedirect`

To link and redirect throughout your application with named routing, you can use both the `NamedLink` and `NamedRedirect`
which use the same API. They both take a `to` prop that accept a valid route name (otherwise an error will be thrown).

```jsx harmony
<NamedLink to="home">Link to home</NamedLink>
```

You can pass parameters as key/value object to build your urls through the `params` prop. If URL contains a required
parameter and not found in key/values pairs, an error will be thrown to ensure urls are always built the correct way.

```jsx harmony
// This is correct
const redirect = <NamedRedirect to="parametrized" params={{ userId: 42 }} />;

// This will throw
const link = <NamedLink to="parametrized">Link to home</NamedLink>;
```

Optional parameters will not throw an error if not given.

### `NamedSwitch`

Due to the way React router's `Switch` operates, it cannot work with `NamedRoute` component. This is why `react-named-router`
also provides a `NamedSwitch` component that does exactly the same, but requires a `name` prop instead of `path`  on
its children.

As a reminder, the `NamedSwitch` component only renders the first matching child component for current location. This
allows you to use routes that are not matching exact path.

## Advanced usage

React Named Router also provides a context API that allows you to perform `push` and `replace` operations using route
naming. This API is available through an [HOC](https://reactjs.org/docs/higher-order-components.html) or a
[React Hook](https://reactjs.org/docs/hooks-intro.html).

### `withNamedRouting(Component)`

The `withNamedRouting` HOC injects into your component a prop named `namedRouting` which contains an object that allows
you to use the HTML history API methods `push` and `replace` with naming.

```jsx harmony
const MyComponent = withNamedRouting(({ namedRouting }) => (
  <div>
    I'm a message box
    <button onClick={() => namedRouting.push('home')}>Go to home</button>
  </div>
))
```

Both functions take a second argument `params` to build parameterized URLs.

:warning: When using named router on server side, you will replace default router by `StaticRouter` and therefore
history API will not be available. The context will then only contain helper methods which are covered in the API
section. The only way to continue having those methods available is to provide `NamedRouter` the `history` prop
with a memory history object.

### `useNamedRouting()`

This function is a React Hook and can only be used in React functional components. Prefer use this over the HOC because
it bloats less your React tree in the debugger and is much more friendly to test/mock. This hook returns exactly the
same object as the `namedRouting` prop when using the HOC.

```jsx harmony
const MyComponent = () => {
  const { push } = useNamedRouting();
  return <button onClick={() => push('home')}>Go to home</button>;
}
```

## Configuration first usage

`react-named-router` allows you to leverage the power of your routes configuration while maintaining high flexibility
about where to render each route. The `NamedRoute` component will use all fields from the matching route to build its
props:

```jsx harmony
// Configuration file
const routes = [
  { name: 'home', path: '/', component: Home },
  { name: 'userDetails', path: '/users/:userId', exact: true, component: UserDetails },
]

// Component file
const MyComponent = () => (
  <>
    <LeftContainer>
      <NamedRoute name="home" />
    </LeftContainer>
    <RightContainer>
      <NamedRoute name="userDetails" />
    </RightContainer>
  </>
)
```

## With `react-router-config`

Since route configuration objects of `react-named-router` are based on `react-router-config` configuration objects, you
can simply use it as you would normally but adding an extra `name` property to each route object having a `path` property.

```jsx harmony
const Users = ({ route }) => renderRoutes(route.routes);

const routes = [
  { name: 'home', path: '/', exact: true, component: Home },
  {
    name: 'users',
    path: '/users',
    component: Users,
    routes: [
      { name: 'userDetails', path: '/users/:userId', component: UserDetails, exact: true },
      { component: UsersList },
    ],
  },
];

const App = () => renderRoutes(routes);
```

## I18n (translated route paths)

As said earlier i18n is really easy using named routing. Here's an example using [`react-i18next`](https://react.i18next.com/):

```jsx harmony
i18next.addResourceBundle('en', 'urls', { users: 'users' });
i18next.addResourceBundle('fr', 'urls', { users: 'utilisateurs' });

const App = ({ lang }) => {
  const { t } = useTranslation();
  const routes = useMemo(() => [
    { name: 'users', path: t('urls:users') }
  ], [lang]);

  return (
    <NamedRouter routes={routes}>
      {/* App content */}
    </NamedRouter>
  )
}
```

You can also base lang on a lang param inside URL.

## SSR

Server side rendering is a cool feature that ensure great performance for mobile users and better SEO, and named
router can also help with that. You need to use the `StaticRouter` instead of the regular `BrowserRouter` by
providing the `routerComponent` prop:

```jsx harmony
const handleGet = (req, res) => {
  res(ReactDOMServer.renderToString((
    <NamedRouter routerComponent={StaticRouter} routerProps={{ location: req.url }} routes={routes}>
      {/* App content */}
    </NamedRouter>
  )));
}
```

You can also build a meta tags/page title system based on named routes:

```jsx harmony
const meta = { home: { title: 'My awesome page' } };

const routingContext = buildRoutingContext(routes);

const handleGet = (req, res) => {
  const { name } = routingContext.match(req.url);
  const { title } = meta[name].title;
  // Render app with title...
}
```

## API

### `NamedRouter`

This is the main component and serves as a provider for the routing in your app. It must be placed inside of your top
level component or within your initial call of `ReactDOM.render`.

| prop                | type                       | required | description                                                          |
|---------------------|----------------------------|----------|----------------------------------------------------------------------|
| **routes**          | `NamedRouteConfig[]`       | **yes**  | An array of route configuration objects                              |
| **routerComponent** | `React.ComponentType<any>` |          | React component used as router (`BrowserRouter`, `StaticRouter`, etc)|
| **routerProps**     | `any`                      |          | Props passed the the router component                                |
| **children**        | `React.ReactNode`          |          | Children elements to render inside router.                           |

Route name can be an array to have aliases for a same route. Tough only the first name will come up in routing
resolution (like when using `match` or when you use `NamedRoute`).

### `NamedLink`

Based on the React Router [Link](https://reacttraining.com/react-router/web/api/Link) component. It uses all the same
props except `to` which is configured by Named Router.

| prop                | type     | required | description                                                         |
|---------------------|----------|----------|---------------------------------------------------------------------|
| **to**              | `string`, `object` | **yes**  | Name of the route used as link target                     |
| **params**          | `object` |          | Object containing key/values to generate parameterized URLs         |

NamedLink throw the following errors:

- `Undefined route "$name"`: When the `to` prop does not match any route given to the `NamedRouter`.
- `Route "$name" does not have a path`: When the `to` prop points to an existing route which does not have a path (like wrapper routes).
- `Missing value for required param "$paramKey"`: When the `params` prop is missing a key/value pair to generate URL.

The `to` prop can also take a location object to provide a state. This is useful when redirecting user to login and
keeping somewhere the url from which user was redirected. The location object has the following signature:

| location property   | type     | required | description                                                         |
|---------------------|----------|----------|---------------------------------------------------------------------|
| **name**            | `string` | **yes**  | Name of the route used as link target                               |
| **state**           | `object` |          | Object containing key/values to keep in location state              |
| **search**          | `string` |          | URL query string (eg `?param=1234`)                                 |
| **hash**            | `string` |          | URL anchor (eg `#section42`)                                        |


### `NamedRedirect`

Based on the React Router [Redirect](https://reacttraining.com/react-router/web/api/Redirect) component. Uses the same
API and errors as `NamedLink`.

### `NamedRoute`

Based on the React Router [Route](https://reacttraining.com/react-router/web/api/Route) component. Only the `path` prop
is overridden by Named Router.

| prop                | type     | required | description                                                         |
|---------------------|----------|----------|---------------------------------------------------------------------|
| **name**            | `string` | **yes**  | Name of the route used for route path generation                   |

NamedRoute throw the following errors:

- `Undefined route "$name"`: When the `to` prop does not match any route given to the `NamedRouter`.

Also NamedRoute will forward all fields from matching route to Route component (`path`, `exact`, `component`).

### `NamedSwitch`

Based on the React Router [Switch](https://reacttraining.com/react-router/web/api/Switch) component.

| prop                | type       | required | description                                                          |
|---------------------|------------|----------|----------------------------------------------------------------------|
| **location**        | `Location` |          | Location to be used for route matching, defaults to context location |

### `buildRoutingContext(routes: NamedRouteConfig[], routerContext: RoutingContextArg, basename?: string)`

Utility function that can be used to build the context on server side rendering to get the name of the current route.
This is useful when you need to generate meta tags, page title or anything else depending on which route is matching.

⚠️ If you use a `basename` on frontend, be sure to pass it to `buildRoutingContext` otherwise `context.match` won't
work properly.

### `useParams()`

React hook that enables you to quickly retrieve current matching route params (see `BaseRoutingContext.params`).

### `useLocation()`

A React hook to retrieve current location. Contains pathname, state, etc.

### `useCurrentRoute()`

This React hook will let you use the currently exact matching route.

### Context API

#### `BaseRoutingContext`

This object is returned when using `withNamedRouting` or `useNamedRouting`.

##### `location: Location`

Current location used within the router, can be useful to get `location.pathname` or `location.state`.

##### `params: { [key: string]: string }`

Current matching route params. Can be used to get url params from anywhere within the application.

##### `exactParams: { [key: string]: string }`

Same as `params` but only for `exact` routes.

##### `currrentRoute: ExtendedRouteConfig | null`

Current matching route (can match only exact paths).

##### `match(pathname: string, matchAll?: boolean)`

This function returns the first route matching exactly the given pathname or null if no match found. Also matches only
route with exact property. The returned route object is the object from your route configuration plus two additional
properties:

- `regex`: a Regular expression to test pathname against for matching.
- `parents`: list of parent routes (array of route names).

The `matchAll` param allows you to match index routes (non exact routes).

##### `getPath(name: string, params?: object)`

Generates path for route matching the given route name. Throws an error if no route is matching. Second argument is used
for parameterized URLs generation. Throws also an error if required parameter is missing.

##### `getRoute(name: string)`

Retrieve route object for given route name. Throws an error if route is not found.

##### `push(location: string | NamedLocation, params?: object)`

Issue a push into the history API (`pushState` for HTML5 History) using the given route name and params. Throws the
same errors as `getPath`. `params` is used to generate path if route has arguments. You can also use a location like
object to provide `search` and/or `state`.

⚠️ This method will throw an error if used without history being available (typically on server side).

##### `replace(location: string | NamedLocation, params?: object)`

Replaces current location, using history API (`replaceState` for HTML5 History) with the given route name and params.
Throws the same errors as `getPath`.`params` is used to generate path if route has arguments. You can also use a location like
object to provide `search` and/or `state`.

⚠️ This method will throw an error if used without history being available (typically on server side).

## Contribute

This project is written in [TypeScript](https://www.typescriptlang.org/) and uses [ESLint](https://eslint.org/) as linter to unsure code quality.
Tests are written using [Jest](https://jestjs.io/).
Package manager used is [Yarn](https://yarnpkg.com)

Run tests:

```bash
yarn test
```

Run build:

```bash
yarn build
```
