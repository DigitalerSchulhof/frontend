import { getValue, isFieldRequested, yieldFieldArguments } from '../utils';
import { getFirstArgument, getFirstFieldNodeAsResolveInfo } from './__utils__';

// Tests `yieldFieldNodes()` and `getFieldArgument[s]()` indirectly
describe('yieldFieldArguments()', () => {
  it("doesn't operate on the root node", () => {
    expect([
      ...yieldFieldArguments(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo
          }
        `),
        ['foo'],
        'bar'
      ),
    ]).toEqual([]);

    expect([
      ...yieldFieldArguments(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo(bar: "baz")
          }
        `),
        ['foo'],
        'bar'
      ),
    ]).toEqual([]);
  });

  it('returns the value of an argument if provided once', () => {
    expect([
      ...yieldFieldArguments(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              bar(baz: "qux")
            }
          }
        `),
        ['bar'],
        'baz'
      ),
    ]).toEqual(['qux']);
  });

  it('returns the value of a nested argument if provided once', () => {
    expect([
      ...yieldFieldArguments(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              bar {
                baz {
                  qux(quux: "corge")
                }
              }
            }
          }
        `),
        ['bar', 'baz', 'qux'],
        'quux'
      ),
    ]).toEqual(['corge']);
  });

  it('returns the value of an argument if provided multiple times', () => {
    expect([
      ...yieldFieldArguments(
        getFirstFieldNodeAsResolveInfo(`
        query {
          foo {
            bar {
              baz {
                a: qux(quux: "corge")
                a: qux(quux: "grault")
              }
            }
          }
        }
      `),
        ['bar', 'baz', 'qux'],
        'quux'
      ),
    ]).toEqual(['corge', 'grault']);
  });

  it('returns the value of a nested argument if provided multiple times', () => {
    expect([
      ...yieldFieldArguments(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              a: bar(baz: "qux")
              b: bar(baz: "quux")
            }
          }
        `),
        ['bar'],
        'baz'
      ),
    ]).toEqual(['qux', 'quux']);
  });

  it('returns the value of an argument if provided multiple times across multiple selections', () => {
    expect([
      ...yieldFieldArguments(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              bar {
                a: baz(qux: "quux")
              }
              bar {
                b: baz(qux: "corge")
              }
            }
          }
        `),
        ['bar', 'baz'],
        'qux'
      ),
    ]).toEqual(['quux', 'corge']);
  });

  it('returns the value of a nested argument if provided multiple times across multiple selections', () => {
    expect([
      ...yieldFieldArguments(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              bar {
                baz {
                  a: qux(quux: "corge")
                }
              }
              bar {
                baz {
                  b: qux(quux: "grault")
                }
              }
            }
          }
        `),
        ['bar', 'baz', 'qux'],
        'quux'
      ),
    ]).toEqual(['corge', 'grault']);

    expect([
      ...yieldFieldArguments(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              bar {
                baz {
                  a: qux(quux: "corge")
                  b: qux(quux: "corge")
                }
              }
              bar {
                baz {
                  c: qux(quux: "grault")
                  d: qux(quux: "grault")
                }
              }
            }
          }
        `),
        ['bar', 'baz', 'qux'],
        'quux'
      ),
    ]).toEqual(['corge', 'corge', 'grault', 'grault']);
  });
});

describe('isFieldRequested()', () => {
  it('returns false on the root node', () => {
    expect(
      isFieldRequested(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo
          }
        `),
        ['foo']
      )
    ).toBe(false);
  });

  it('returns true if set once', () => {
    expect(
      isFieldRequested(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              bar
            }
          }
        `),
        ['bar']
      )
    ).toBe(true);
  });

  it('returns true if nested set once', () => {
    expect(
      isFieldRequested(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              bar {
                baz {
                  qux(quux: "corge")
                }
              }
            }
          }
        `),
        ['bar', 'baz', 'qux']
      )
    ).toBe(true);
  });

  it('returns true if nested set multiple times', () => {
    expect(
      isFieldRequested(
        getFirstFieldNodeAsResolveInfo(`
        query {
          foo {
            bar {
              baz {
                a: qux(quux: "corge")
                a: qux(quux: "grault")
              }
            }
          }
        }
      `),
        ['bar', 'baz', 'qux']
      )
    ).toBe(true);
  });

  it('returns true if set multiple times', () => {
    expect(
      isFieldRequested(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              a: bar(baz: "qux")
              b: bar(baz: "quux")
            }
          }
        `),
        ['bar']
      )
    ).toBe(true);
  });

  it('returns true if set multiple times across multiple selections', () => {
    expect(
      isFieldRequested(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              bar {
                a: baz(qux: "quux")
              }
              bar {
                b: baz(qux: "corge")
              }
            }
          }
        `),
        ['bar', 'baz']
      )
    ).toBe(true);
  });

  it('returns true if set multiple times across multiple selections', () => {
    expect(
      isFieldRequested(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              bar {
                baz {
                  a: qux(quux: "corge")
                }
              }
              bar {
                baz {
                  b: qux(quux: "grault")
                }
              }
            }
          }
        `),
        ['bar', 'baz', 'qux']
      )
    ).toBe(true);
  });

  it('returns false if not set', () => {
    expect(
      isFieldRequested(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              bar {
                baz
              }
            }
          }
        `),
        ['bar', 'baz', 'qux']
      )
    ).toBe(false);

    expect(
      isFieldRequested(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              bar {
                baz {
                  quux
                }
              }
            }
          }
        `),
        ['bar', 'baz', 'qux']
      )
    ).toBe(false);
  });

  it('returns false if not set across multiple selections', () => {
    expect(
      isFieldRequested(
        getFirstFieldNodeAsResolveInfo(`
          query {
            foo {
              bar {
                baz {
                  quux
                }
              }
              bar {
                baz {
                  corge
                }
              }
            }
          }
        `),
        ['bar', 'baz', 'qux']
      )
    ).toBe(false);
  });
});

describe('getValue()', () => {
  test('variable', () => {
    expect(
      getValue(
        {
          baz: 'qux',
          qux: 'corge',
        },
        getFirstArgument(`
         query {
           foo(bar: $baz)
         }
       `)
      )
    ).toBe('qux');

    expect(
      getValue(
        {
          baz: null,
        },
        getFirstArgument(`
         query {
           foo(bar: $baz)
         }
       `)
      )
    ).toBe(null);
  });

  test('null', () => {
    expect(
      getValue(
        {},
        getFirstArgument(`
         query {
           foo(bar: null)
         }
       `)
      )
    ).toBe(null);
  });

  test('list', () => {
    expect(
      getValue(
        {
          arg: ['foo', 'bar'],
        },
        getFirstArgument(`
         query {
           foo(bar: ["qux", ["nesting :o", $arg]])
         }
       `)
      )
    ).toEqual(['qux', ['nesting :o', ['foo', 'bar']]]);
  });

  test('object', () => {
    expect(
      getValue(
        {},
        getFirstArgument(`
         query {
           foo(bar: { qux: "corge", grault: ["garply"] })
         }
       `)
      )
    ).toEqual({ qux: 'corge', grault: ['garply'] });
  });

  test('int', () => {
    expect(
      getValue(
        {},
        getFirstArgument(`
         query {
           foo(bar: 1)
         }
       `)
      )
    ).toBe(1);
  });

  test('float', () => {
    expect(
      getValue(
        {},
        getFirstArgument(`
         query {
           foo(bar: 1.1)
         }
       `)
      )
    ).toBe(1.1);
  });

  test('string', () => {
    expect(
      getValue(
        {},
        getFirstArgument(`
         query {
           foo(bar: "baz")
         }
       `)
      )
    ).toBe('baz');
  });

  test('boolean', () => {
    expect(
      getValue(
        {},
        getFirstArgument(`
         query {
           foo(bar: true)
         }
       `)
      )
    ).toBe(true);
  });

  test('enum', () => {
    expect(
      getValue(
        {},
        getFirstArgument(`
         query {
           foo(bar: FOO)
         }
       `)
      )
    ).toBe('FOO');
  });
});
