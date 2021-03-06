import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from 'history';
import { matchPath, match as Match, Route } from 'react-router';
import invariant from 'tiny-invariant';
import { useNamedRouting } from './hooks';

export interface NamedSwitchProps {
  location?: Location;
  children?: React.ReactNode;
}

export const NamedSwitch: React.FC<NamedSwitchProps> = ({ location: locationFromProps, children }) => {
  const context = useNamedRouting();

  invariant(context, 'You should not use <NamedSwitch> outside a <NamedRouter>');

  const location = locationFromProps || (context.location as Location);

  return (
    <Route>
      {({ match: parentMatch }) => {
        let element = null;
        let match: null | Match = null;

        React.Children.forEach(children, (child) => {
          if (match === null && React.isValidElement(child)) {
            element = child;

            const path = child.props.name ? context.getRawPath(child.props.name) : child.props.from;
            const route = child.props.name ? context.getRoute(child.props.name) : {};

            match = path
              ? matchPath(location.pathname, { ...route, ...child.props, path })
              : parentMatch;
          }
        });

        return match && element
          ? React.cloneElement(element, { location, computedMatch: match })
          : null;
      }}
    </Route>
  );
};

NamedSwitch.displayName = 'NamedSwitch';
