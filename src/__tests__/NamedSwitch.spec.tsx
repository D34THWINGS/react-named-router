import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Route, StaticRouter, StaticRouterProps } from 'react-router';
import { NamedSwitch } from '../NamedSwitch';
import { NamedRouter } from '../NamedRouter';
import { NamedRoute } from '../NamedRoute';
import { NamedRouteConfig } from '../utils';

Enzyme.configure({ adapter: new Adapter() });

describe('NamedSwitch', () => {
  it('should render only first matching route', () => {
    // Given
    const routerProps: StaticRouterProps = { location: '/foo/bar' };

    // When
    const wrapper = mount((
      <NamedRouter
        routes={[{ name: 'foo', path: '/foo' }, { name: 'bar', path: '/foo/bar' }]}
        routerComponent={StaticRouter}
        routerProps={routerProps}
      >
        <NamedSwitch>
          <NamedRoute name="foo" exact />
          <NamedRoute name="bar" />
        </NamedSwitch>
      </NamedRouter>
    ));

    // Then
    expect(wrapper.find('NamedSwitch')).toMatchSnapshot();
  });

  it('should spread matching route properties', () => {
    // Given
    const FooComponent: React.FC = () => <div>Foo</div>;
    const BarComponent: React.FC = () => <div>Bar</div>;
    const routerProps: StaticRouterProps = { location: '/foo/bar' };
    const routes: NamedRouteConfig[] = [
      { name: 'foo', path: '/foo', exact: true, component: FooComponent },
      { name: 'bar', path: '/foo/bar', component: BarComponent },
    ];

    // When
    const wrapper = mount((
      <NamedRouter
        routes={routes}
        routerComponent={StaticRouter}
        routerProps={routerProps}
      >
        <NamedSwitch>
          <NamedRoute name="foo" />
          <NamedRoute name="bar" />
        </NamedSwitch>
      </NamedRouter>
    ));

    // Then
    expect(wrapper.find('NamedSwitch')).toMatchSnapshot();
  });

  it('should render wildcard route if none matched', () => {
    // Given
    const routerProps: StaticRouterProps = { location: '/foo/bar' };
    const routes: NamedRouteConfig[] = [
      { name: 'foo', path: '/foo', exact: true },
    ];

    // When
    const wrapper = mount((
      <NamedRouter
        routes={routes}
        routerComponent={StaticRouter}
        routerProps={routerProps}
      >
        <NamedSwitch>
          <NamedRoute name="foo" />
          <Route render={() => 'Not found'} />
        </NamedSwitch>
      </NamedRouter>
    ));

    // Then
    expect(wrapper.find('NamedSwitch')).toMatchSnapshot();
  });
});
