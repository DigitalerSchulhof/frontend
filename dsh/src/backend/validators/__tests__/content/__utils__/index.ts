import { ClassRepository } from '#/backend/repositories/content/class';
import { CourseRepository } from '#/backend/repositories/content/course';
import { LevelRepository } from '#/backend/repositories/content/level';
import { SchoolyearRepository } from '#/backend/repositories/content/schoolyear';

jest.mock('#/repositories/filters', () => ({
  ...jest.requireActual('#/repositories/filters'),
  AndFilter: class {
    private readonly filters: any[];

    constructor(...filters: any[]) {
      this.filters = filters;
    }

    apply = (node: any) => {
      return this.filters.filter((f) => f !== null).every((f) => f.apply(node));
    };
  },
  OrFilter: class {
    private readonly filters: any[];

    constructor(...filters: any[]) {
      this.filters = filters;
    }

    apply(node: any) {
      return this.filters.filter((f) => f !== null).some((f) => f.apply(node));
    }
  },
  __esModule: true,
}));

jest.mock('#/repositories/filters/operators', () => ({
  EqFilterOperator: class {
    constructor(private readonly value: any) {}

    apply = (node: any) => node === this.value;
  },
  NeqFilterOperator: class {
    constructor(private readonly value: any) {}

    apply = (node: any) => node !== this.value;
  },
  __esModule: true,
}));

export function makeMockFilter(prop: string) {
  return class {
    constructor(private readonly operator: any) {}

    apply(node: any) {
      return this.operator.apply(node[prop]);
    }
  };
}

export function makeSimpleMockRepository() {
  return {
    getByIds: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    filterDelete: jest.fn(),
    search: jest.fn(),
  };
}

type SimpleMockRepository = ReturnType<typeof makeSimpleMockRepository>;

export function makeMockRepositories() {
  return {
    schoolyear: makeSimpleMockRepository() as SimpleMockRepository &
      SchoolyearRepository,
    level: makeSimpleMockRepository() as SimpleMockRepository & LevelRepository,
    class: makeSimpleMockRepository() as SimpleMockRepository & ClassRepository,
    course: makeSimpleMockRepository() as SimpleMockRepository &
      CourseRepository,
  };
}

export function setMockRepositoryDataset(
  mockRepository: SimpleMockRepository,
  nodes: any[]
) {
  mockRepository.getByIds.mockImplementation(async (ids) =>
    nodes.filter((n) => ids.includes(n.id))
  );

  mockRepository.search.mockImplementation(async (search) => {
    const res = applySearch(nodes, search);

    return {
      nodes: res,
      total: res.length,
    };
  });
}

function applySearch(nodes: any[], search: any) {
  const { filter, offset, limit } = search;

  // We have mocked filters with our test filters that operate on the node directly
  const res = nodes.filter(filter.apply);

  return res.slice(offset ?? 0, limit ?? nodes.length);
}

/**
 * Returns a matcher that matches an AggregatedInputError with exactly the given error code.
 */
export function expectAggregatedInputValidationError(code: string) {
  return expect.objectContaining({
    errors: [expectInputValidationError(code)],
  });
}

/**
 * Returns a matcher that matches an InputValidationError with the given error code.
 */
export function expectInputValidationError(code: string) {
  return expect.objectContaining({
    code,
  });
}
