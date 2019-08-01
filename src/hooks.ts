import { useContext } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from 'history';
import { namedRouterContext } from './NamedRouter';

export const useNamedRouting = () => useContext(namedRouterContext);

export const useLocation = <TState = any>(): Location<TState> => useNamedRouting().location;

export const useParams = <TParams extends { [key: string]: string } = {}>(): TParams => (
  useNamedRouting().params as TParams);
