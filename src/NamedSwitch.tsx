import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from 'history';
import { matchPath, match as Match } from 'react-router';
import invariant from 'tiny-invariant';
import { useNamedRouting } from './NamedRouter';

export interface NamedSwitchProps {
  location?: Location;
  children?: React.ReactNode;
}

const NamedSwitch = ({ location: locationFromProps, children }: NamedSwitchProps) => {
  const context = useNamedRouting();

  invariant(context, 'You should not use <NamedSwitch> outside a <NamedRouter>');

  const location = locationFromProps || context.location;
  let element = null;
  let match: null | Match = null;

  React.Children.forEach(children, (child) => {
    if (match === null && React.isValidElement(child)) {
      element = child;

      const path = child.props.name ? context.getRawPath(child.props.name) : child.props.from;
      const route = child.props.name ? context.getRoute(child.props.name) : {};

      match = matchPath(location.pathname, { ...route, ...child.props, path });
    }
  });

  return match && element
    ? React.cloneElement(element, { location, computedMatch: match })
    : null;
};

export default NamedSwitch;
