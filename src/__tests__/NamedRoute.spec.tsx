import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { StaticRouter, StaticRouterProps } from 'react-router';
import { NamedRouter } from '../NamedRouter';
import { NamedRoute } from '../NamedRoute';
import { NamedRouteConfig } from '../utils';

Enzyme.configure({ adapter: new Adapter() });

describe('NamedSwitch', () => {
  it('should render only first matching route', () => {
    // Given
    const routerProps: StaticRouterProps = { location: '/foo' };
    const routes: NamedRouteConfig[] = [{
      name: 'foo',
      path: '/foo',
      exact: true,
      component: () => null,
    }];

    // When
    const wrapper = mount((
      <NamedRouter
        routes={routes}
        routerComponent={StaticRouter}
        routerProps={routerProps}
      >
        <NamedRoute name="foo" />
      </NamedRouter>
    ));

    // Then
    expect(wrapper).toMatchSnapshot();
  });
});
