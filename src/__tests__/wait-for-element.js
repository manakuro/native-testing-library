import React from 'react';
import { Text, View } from 'react-native';

import { render } from '../';
import { waitForElement } from '../wait-for-element';

test('waits for element to appear in the document', async () => {
  const { rerender, getByTestId } = render(<View />);
  const promise = waitForElement(() => getByTestId('test'));
  setTimeout(() => rerender(<View testID="test" />));
  const element = await promise;
  expect(element).toBeTruthy();
});

test('waits for element to appear in a specified container', async () => {
  const { rerender, container, getByTestId } = render(<View />);
  const promise = waitForElement(() => getByTestId('test'), { container });
  setTimeout(() => rerender(<View testID="test" />));
  const element = await promise;
  expect(element).toBeTruthy();
});

test('can time out', async () => {
  jest.useFakeTimers();
  const promise = waitForElement(() => {});
  jest.advanceTimersByTime(4600);
  await expect(promise).rejects.toThrow(/timed out/i);
  jest.useRealTimers();
});

test('can specify our own timeout time', async () => {
  jest.useFakeTimers();
  const promise = waitForElement(() => {}, { timeout: 4700 });
  const handler = jest.fn();
  promise.then(handler, handler);

  jest.advanceTimersByTime(4600);
  expect(handler).toHaveBeenCalledTimes(0);

  jest.advanceTimersByTime(150);

  await expect(promise).rejects.toThrow(/timed out/i);
  jest.useRealTimers();
});

test('throws last thrown error', async () => {
  const { rerender, container } = render(<View />);
  let error;
  setTimeout(() => {
    error = new Error('first error');
    rerender(<Text>first</Text>);
  }, 10);
  setTimeout(() => {
    error = new Error('second error');
    rerender(<Text>second</Text>);
  }, 20);
  const promise = waitForElement(
    () => {
      throw error;
    },
    { container, timeout: 50 },
  );
  await expect(promise).rejects.toThrow(error);
});

test('waits until callback does not return null', async () => {
  const { rerender, container, queryByTestId } = render(<View />);
  const promise = waitForElement(() => queryByTestId('text'), { container });
  rerender(<View testID="text" />);
  const element = await promise;
  expect(element).toBeTruthy();
});

test('throws error if no callback is provided', async () => {
  await expect(waitForElement()).rejects.toThrow(/callback/i);
});
