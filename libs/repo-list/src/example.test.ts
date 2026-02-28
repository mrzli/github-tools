import { describe, expect, it } from 'bun:test';
import { someFunction } from './example';

describe('example', () => {
  describe('someFunction()', () => {
    it('should return a greeting', () => {
      expect(someFunction()).toBe('Hello World!');
    });
  });
});
