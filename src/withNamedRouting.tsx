import React from 'react';

import { useNamedRouting } from './hooks';
import { RoutingContext } from './utils';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface WithNamedRoutingProps {
  namedRouting: RoutingContext;
}

export function withNamedRouting<TProps extends WithNamedRoutingProps>(
  Component: React.ComponentType<WithNamedRoutingProps>,
) {
  const WrappedComponent = (props: Omit<TProps, keyof WithNamedRoutingProps>) => {
    const namedRouting = useNamedRouting();
    return (
      <Component {...props} namedRouting={namedRouting} />
    );
  };
  WrappedComponent.displayName = `WithRouting(${Component.displayName || Component.name})`;
  return WrappedComponent;
}
