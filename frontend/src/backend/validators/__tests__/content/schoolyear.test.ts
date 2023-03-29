import { IdNotFoundError } from '#/repositories/errors';
import {
  SchoolyearValidator,
  SCHOOLYEAR_NAME_EXISTS,
  SCHOOLYEAR_NAME_INVALID,
  SCHOOLYEAR_START_NOT_BEFORE_END,
} from '../../content/schoolyear';
import {
  expectAggregatedInputValidationError,
  makeMockRepositories,
  setMockRepositoryDataset,
} from './__utils__';

jest.mock('#/repositories/content/schoolyear/filters', () => {
  const { makeMockFilter } = jest.requireActual('./__utils__');

  return {
    SchoolyearIdFilter: makeMockFilter('id'),
    SchoolyearNameFilter: makeMockFilter('name'),
  };
});

const mockRepositories = makeMockRepositories();

const validator = new SchoolyearValidator(mockRepositories);

describe('SchoolyearValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setMockRepositoryDataset(mockRepositories.schoolyear, []);
  });

  describe('assertCanCreate', () => {
    it('throws if the start date is after or equal to the end date', async () => {
      await expect(
        validator.assertCanCreate({
          name: 'test',
          start: 2,
          end: 1,
        })
      ).rejects.toThrow(
        expectAggregatedInputValidationError(SCHOOLYEAR_START_NOT_BEFORE_END)
      );

      await expect(
        validator.assertCanCreate({
          name: 'test',
          start: 1,
          end: 1,
        })
      ).rejects.toThrow(
        expectAggregatedInputValidationError(SCHOOLYEAR_START_NOT_BEFORE_END)
      );
    });

    it("doesn't throw if the start date is before the end date", async () => {
      await expect(
        validator.assertCanCreate({
          name: 'test',
          start: 1,
          end: 2,
        })
      ).resolves.toBeUndefined();
    });

    it("throws if the schoolyear's name is invalid", async () => {
      await expect(
        validator.assertCanCreate({
          name: '',
          start: 1,
          end: 2,
        })
      ).rejects.toThrow(
        expectAggregatedInputValidationError(SCHOOLYEAR_NAME_INVALID)
      );
    });

    it("doesn't throw if the schoolyear's name is valid", async () => {
      await expect(
        validator.assertCanCreate({
          name: 'test',
          start: 1,
          end: 2,
        })
      ).resolves.toBeUndefined();
    });

    it('throws if a schoolyear with the same name exists', async () => {
      setMockRepositoryDataset(mockRepositories.schoolyear, [
        {
          id: '1',
          name: 'test',
          start: 1,
          end: 2,
        },
      ]);

      await expect(
        validator.assertCanCreate({
          name: 'test',
          start: 1,
          end: 2,
        })
      ).rejects.toThrow(
        expectAggregatedInputValidationError(SCHOOLYEAR_NAME_EXISTS)
      );
    });

    it("doesn't throw if a schoolyear with the same name doesn't exist", async () => {
      await expect(
        validator.assertCanCreate({
          name: 'test',
          start: 1,
          end: 2,
        })
      ).resolves.toBeUndefined();
    });
  });

  describe('assertCanUpdate', () => {
    beforeEach(() => {
      setMockRepositoryDataset(mockRepositories.schoolyear, [
        {
          id: '1',
          name: 'test',
          start: 1,
          end: 2,
        },
      ]);
    });

    it("throws if the schoolyear doesn't exist", async () => {
      setMockRepositoryDataset(mockRepositories.schoolyear, []);

      await expect(validator.assertCanUpdate('1', {})).rejects.toThrow(
        expect.any(IdNotFoundError)
      );
    });

    it("doesn't throw if the schoolyear exists", async () => {
      await expect(validator.assertCanUpdate('1', {})).resolves.toBeUndefined();
    });

    it('throws if the start date is after or equal to the end date', async () => {
      await expect(
        validator.assertCanUpdate('1', {
          start: 2,
          end: 1,
        })
      ).rejects.toThrow(
        expectAggregatedInputValidationError(SCHOOLYEAR_START_NOT_BEFORE_END)
      );

      await expect(
        validator.assertCanUpdate('1', {
          start: 1,
          end: 1,
        })
      ).rejects.toThrow(
        expectAggregatedInputValidationError(SCHOOLYEAR_START_NOT_BEFORE_END)
      );
    });

    it("doesn't throw if the start date is before the end date", async () => {
      await expect(
        validator.assertCanUpdate('1', {
          start: 1,
          end: 2,
        })
      ).resolves.toBeUndefined();
    });

    it("falls back to the base dates if they aren't provided", async () => {
      await expect(
        validator.assertCanUpdate('1', {
          start: 2,
        })
      ).rejects.toThrow(
        expectAggregatedInputValidationError(SCHOOLYEAR_START_NOT_BEFORE_END)
      );

      await expect(
        validator.assertCanUpdate('1', {
          end: 1,
        })
      ).rejects.toThrow(
        expectAggregatedInputValidationError(SCHOOLYEAR_START_NOT_BEFORE_END)
      );
    });

    it("throws if the schoolyear's name is invalid", async () => {
      await expect(
        validator.assertCanUpdate('1', {
          name: '',
        })
      ).rejects.toThrow(
        expectAggregatedInputValidationError(SCHOOLYEAR_NAME_INVALID)
      );
    });

    it.only("doesn't throw if the schoolyear's name is valid", async () => {
      await expect(
        validator.assertCanUpdate('1', {
          name: 'test',
        })
      ).resolves.toBeUndefined();
    });

    it('throws if a schoolyear with the same name exists', async () => {
      setMockRepositoryDataset(mockRepositories.schoolyear, [
        {
          id: '1',
          name: 'test',
          start: 1,
          end: 2,
        },
        {
          id: '2',
          name: 'test2',
          start: 3,
          end: 4,
        },
      ]);

      await expect(
        validator.assertCanUpdate('2', {
          name: 'test',
        })
      ).rejects.toThrow(
        expectAggregatedInputValidationError(SCHOOLYEAR_NAME_EXISTS)
      );
    });

    it("doesn't throw if a schoolyear with the same name doesn't exist", async () => {
      await expect(
        validator.assertCanUpdate('1', {
          name: 'test2',
        })
      ).resolves.toBeUndefined();
    });
  });
});
