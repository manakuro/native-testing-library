import { ReactTestRenderer, ReactTestInstance } from 'react-test-renderer';

import { Matcher, MatcherOptions } from './matches';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type SelectorMatcherOptions = Omit<MatcherOptions, 'selector'> & {
  selector?: string;
};

type ReactTestInstance = {
  getProp: (str: string) => NativeTestInstance;
};

export type NativeTestInstance = Omit<
  ReactTestInstance,
  'findAllByProps' | 'findAllByType' | 'findByProps' | 'findByType' | 'instance'
>;

export type QueryByProp = (
  attribute: string,
  testRenderer: ReactTestRenderer,
  match: Matcher,
  options?: MatcherOptions,
) => NativeTestInstance | null;

export type AllByProp = (
  attribute: string,
  testRenderer: HTMLElement,
  id: Matcher,
  options?: MatcherOptions,
) => NativeTestInstance[];

// TODO: finish types of the rest of the helpers
export const defaultFilter: (node: NativeTestInstance) => boolean;
export const getContainer: (
  testRenderer: ReactTestRenderer | ReactTestInstance,
) => ReactTestInstance;
export const getElementError: (message: string, testRenderer: ReactTestRenderer) => Error;
export const queryAllByProp: AllByProp;
export const queryByProp: QueryByProp;
export const proxyElement: (node: ReactTestInstance) => NativeTestInstance;
