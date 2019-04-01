import React from 'react';
import { Text, TextInput } from 'react-native';

import { getNodeText } from './get-node-text';
import { waitForElement } from './wait-for-element';
import { fuzzyMatches, makeNormalizer, matches } from './matches';
import { getElementError, firstResultOrNull, queryAllByProp, queryByProp } from './query-helpers';

const queryByA11yLabel = queryByProp.bind(null, 'accessibilityLabel');
const queryAllByA11yLabel = queryAllByProp.bind(null, 'accessibilityLabel');
const queryByPlaceholder = queryByProp.bind(null, 'placeholder');
const queryAllByPlaceholder = queryAllByProp.bind(null, 'placeholder');
const queryByTestId = queryByProp.bind(null, 'testID');
const queryAllByTestId = queryAllByProp.bind(null, 'testID');
const queryByValue = queryByProp.bind(null, 'value');
const queryAllByValue = queryAllByProp.bind(null, 'value');
const queryByA11yRole = queryByProp.bind(null, 'accessibilityRole');
const queryAllByA11yRole = queryAllByProp.bind(null, 'accessibilityRole');

function queryAllByText(
  container,
  text,
  { types = ['Text', 'TextInput'], exact = true, collapseWhitespace, trim, normalizer } = {},
) {
  const rootInstance = container.root;
  const matcher = exact ? matches : fuzzyMatches;
  const matchNormalizer = makeNormalizer({ collapseWhitespace, trim, normalizer });

  const baseArray = types.reduce(
    (accumulator, currentValue) => [...accumulator, ...rootInstance.findAllByType(currentValue)],
    [],
  );

  return [...baseArray].filter(node => matcher(getNodeText(node), node, text, matchNormalizer));
}

function queryByText(...args) {
  return firstResultOrNull(queryAllByText, ...args);
}

function getAllByTestId(container, id, ...rest) {
  const els = queryAllByTestId(container, id, ...rest);
  if (!els.length) {
    throw getElementError(`Unable to find an element with the testID: ${id}`, container);
  }
  return els;
}

function getByTestId(...args) {
  return firstResultOrNull(getAllByTestId, ...args);
}

function getAllByA11yRole(container, value, ...rest) {
  const els = queryAllByA11yRole(container, value, ...rest);
  if (!els.length) {
    throw getElementError(`Unable to find an element by accessibilityRole="${value}".`, container);
  }
  return els;
}

function getByA11yRole(...args) {
  return firstResultOrNull(getAllByA11yRole, ...args);
}

function getAllByValue(container, value, ...rest) {
  const els = queryAllByValue(container, value, ...rest);
  if (!els.length) {
    throw getElementError(`Unable to find an element with the value: ${value}.`, container);
  }
  return els;
}

function getByValue(...args) {
  return firstResultOrNull(getAllByValue, ...args);
}

function getAllByA11yLabel(container, text, ...rest) {
  const els = queryAllByA11yLabel(container, text, ...rest);
  if (!els.length) {
    throw getElementError(`Unable to find an element by accessibilityLabel="${text}"`, container);
  }
  return els;
}

function getByA11yLabel(...args) {
  return firstResultOrNull(getAllByA11yLabel, ...args);
}

function getAllByPlaceholder(container, text, ...rest) {
  const els = queryAllByPlaceholder(container, text, ...rest);
  if (!els.length) {
    throw getElementError(
      `Unable to find an element with the placeholder text of: ${text}`,
      container,
    );
  }
  return els;
}

function getByPlaceholder(...args) {
  return firstResultOrNull(getAllByPlaceholder, ...args);
}

function getAllByText(container, text, ...rest) {
  const els = queryAllByText(container, text, ...rest);
  if (!els.length) {
    throw getElementError(
      `Unable to find an element with the text: ${text}. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.`,
      container,
    );
  }
  return els;
}

function getByText(...args) {
  return firstResultOrNull(getAllByText, ...args);
}

function makeFinder(getter) {
  return (testContainer, text, options, waitForElementOptions) =>
    waitForElement(
      (container = testContainer) => getter(container, text, options),
      waitForElementOptions,
    );
}

export const findByA11yLabel = makeFinder(getByA11yLabel);
export const findAllByA11yLabel = makeFinder(getAllByA11yLabel);

export const findByPlaceholder = makeFinder(getByPlaceholder);
export const findAllByPlaceholder = makeFinder(getAllByPlaceholder);

const findByText = makeFinder(getByText);
const findAllByText = makeFinder(getAllByText);

export const findByValue = makeFinder(getByValue);
export const findAllByValue = makeFinder(getAllByValue);

export const findByA11yRole = makeFinder(getByA11yRole);
export const findAllByA11yRole = makeFinder(getAllByA11yRole);

export const findByTestId = makeFinder(getByTestId);
export const findAllByTestId = makeFinder(getAllByTestId);

export {
  queryByPlaceholder,
  queryAllByPlaceholder,
  getByPlaceholder,
  getAllByPlaceholder,
  findByText,
  findAllByText,
  queryByText,
  queryAllByText,
  getByText,
  getAllByText,
  queryByA11yLabel,
  queryAllByA11yLabel,
  getByA11yLabel,
  getAllByA11yLabel,
  queryByTestId,
  queryAllByTestId,
  getByTestId,
  getAllByTestId,
  queryByValue,
  queryAllByValue,
  getByValue,
  getAllByValue,
  queryByA11yRole,
  queryAllByA11yRole,
  getAllByA11yRole,
  getByA11yRole,
};
