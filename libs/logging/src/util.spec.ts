import { deepmerge } from './util';

describe('Extend', () => {
  it('creates deep copies', () => {
    const depth = {
      exists: true,
      number: 2,
    };
    const objA = {
      bar: depth,
      foo: 'bar',
    };

    const objC = deepmerge(objA);

    expect(objA).toEqual(objC);
    expect(objA === objC).toBeFalsy();
    expect(objC['foo']).toBe('bar');
    expect(objC['bar'] === depth).toBeFalsy();
    expect(objC['bar'].number).toEqual(2);
    expect(objC['bar'].exists).toBeTruthy();
  });

  it('does a deep merge of two objects', () => {
    const objA = {
      bob: 12.4,
      foo: 'bar',
      stuff: {
        exists: false,
        number: 5,
      },
    };
    const depth = {
      name: 'Here',
      number: 1,
    };
    const objB = {
      bar: 'foo',
      bob: 50,
      stuff: depth,
    };
    const objC = deepmerge(objA, objB);

    expect(objC['foo']).toBe('bar');
    expect(objC['bar']).toBe('foo');
    expect(objC['bob']).toEqual(50);
    expect(objC['stuff'] === depth).toBe(false);
    expect(objC['stuff'].exists).toBeDefined();
    expect(objC['stuff'].exists).toBeFalsy();
    expect(objC['stuff'].number).toEqual(1);
    expect(objC['stuff'].name).toBe('Here');
  });

  it('throws a RangeError when deep copying circular objects', () => {
    const depth = {
      name: 'Here',
      number: 1,
    };
    const objA = {
      bob: 12.4,
      foo: 'bar',
      stuff: depth,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    depth.circular = objA;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const objC = deepmerge(objA);
    } catch (e) {
      expect(e instanceof RangeError).toBeTruthy();
    }
  });

  it('creates new instances of arrays when deep copying', () => {
    const objA = {
      bob: [0, 1, 2],
    };

    const objC = deepmerge(objA);
    expect(objC['bob']).toEqual(objA.bob);
    expect(objC['bob'] === objA.bob).toBe(false);
  });

  it('ignores undefined or null objects', () => {
    const objA = {
      notHere: null,
    };
    const objB = {
      bob: 2,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const objC = deepmerge(objA.missing, objA.notHere, objB);
    expect(objC).toEqual(objB);
  });
});
