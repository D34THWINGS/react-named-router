import React from 'react';

import { useNamedRouting } from './NamedRouter';
import { BaseRoutingContext, RoutingContext } from './utils';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface WithNamedRoutingProps {
  namedRouting: BaseRoutingContext | RoutingContext;
}

function withNamedRouting<TProps extends WithNamedRoutingProps>(Component: React.ComponentType<WithNamedRoutingProps>) {
  const namedRouting = useNamedRouting();
  const WrappedComponent = (props: Omit<TProps, keyof WithNamedRoutingProps>) => (
    <Component {...props} namedRouting={namedRouting} />
  );
  WrappedComponent.displayName = `WithRouting(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

export default withNamedRouting;
