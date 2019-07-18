import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { StaticRouter, StaticRouterProps } from 'react-router';
import NamedSwitch from '../NamedSwitch';
import NamedRouter from '../NamedRouter';
import NamedRoute from '../NamedRoute';

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
    expect(wrapper).toMatchSnapshot();
  });
});
