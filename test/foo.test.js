import { biz } from '../src/foo';

describe('foo', () => {
  test('it should biz', () => {
    expect(biz()).toEqual('ops');
  });
});
