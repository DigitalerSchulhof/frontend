import { ClassRepository } from '@repositories/class';
import { CourseRepository } from '@repositories/course';
import { LevelRepository } from '@repositories/level';
import { SchoolyearRepository } from '@repositories/schoolyear';

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
  let res = nodes;
  for (const key in search.filters) {
    for (const op in search.filters[key]) {
      switch (op) {
        case 'eq':
          if (search.filters[key].eq !== undefined)
            res = res.filter((n) => n[key] === search.filters[key].eq);
          break;
        case 'ne':
          if (search.filters[key].ne !== undefined)
            res = res.filter((n) => n[key] !== search.filters[key].ne);
          break;
        default:
          throw new Error(`Unknown operator ${op}`);
      }
    }
  }

  return res.slice(search.offset ?? 0, search.limit ?? nodes.length);
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
