import { IdNotFoundError } from '../../../repositories/errors';
import {
  LevelValidator,
  LEVEL_NAME_EXISTS,
  SCHOOLYEAR_DOES_NOT_EXIST,
} from '../../content/level';
import {
  expectAggregatedInputValidationError,
  expectInputValidationError,
  makeMockRepositories,
  setMockRepositoryDataset,
} from './__utils__';

const mockRepositories = makeMockRepositories();

const validator = new LevelValidator(mockRepositories);

describe('LevelValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setMockRepositoryDataset(mockRepositories.level, []);
    setMockRepositoryDataset(mockRepositories.schoolyear, [
      {
        id: '1',
        name: 'test',
        start: 1,
        end: 2,
      },
    ]);
  });

  describe('assertCanCreate', () => {
    it('throws if the schoolyear does not exist', async () => {
      await expect(
        validator.assertCanCreate({
          schoolyearId: '2',
          name: 'test',
        })
      ).rejects.toThrow(expectInputValidationError(SCHOOLYEAR_DOES_NOT_EXIST));
    });

    it("doesn't throw if the schoolyear exists", async () => {
      await expect(
        validator.assertCanCreate({
          schoolyearId: '1',
          name: 'test',
        })
      ).resolves.toBeUndefined();
    });

    it('throws if a level with the same name exists in the same schoolyear', async () => {
      setMockRepositoryDataset(mockRepositories.level, [
        {
          id: '1',
          schoolyearId: '1',
          name: 'test',
        },
      ]);

      await expect(
        validator.assertCanCreate({
          schoolyearId: '1',
          name: 'test',
        })
      ).rejects.toThrow(
        expectAggregatedInputValidationError(LEVEL_NAME_EXISTS)
      );
    });

    it("doesn't throw if a level with the same name exists in a different schoolyear", async () => {
      setMockRepositoryDataset(mockRepositories.level, [
        {
          id: '1',
          schoolyearId: '2',
          name: 'test',
        },
      ]);

      await expect(
        validator.assertCanCreate({
          schoolyearId: '1',
          name: 'test',
        })
      ).resolves.toBeUndefined();
    });

    it("doesn't throw if a level with a different name exists in the same schoolyear", async () => {
      setMockRepositoryDataset(mockRepositories.level, [
        {
          id: '1',
          schoolyearId: '1',
          name: 'test2',
        },
      ]);

      await expect(
        validator.assertCanCreate({
          schoolyearId: '1',
          name: 'test',
        })
      ).resolves.toBeUndefined();
    });
  });

  describe('assertCanUpdate', () => {
    beforeEach(() => {
      setMockRepositoryDataset(mockRepositories.level, [
        {
          id: '1',
          schoolyearId: '1',
          name: 'test',
        },
      ]);
    });

    it("throws if the level doesn't exist", async () => {
      await expect(validator.assertCanUpdate('2', {})).rejects.toThrow(
        expect.any(IdNotFoundError)
      );
    });

    it("doesn't throw if the level exists", async () => {
      await expect(validator.assertCanUpdate('1', {})).resolves.toBeUndefined();
    });

    it('throws if a level with the same name exists in the same schoolyear', async () => {
      setMockRepositoryDataset(mockRepositories.level, [
        {
          id: '1',
          schoolyearId: '1',
          name: 'test',
        },
        {
          id: '2',
          schoolyearId: '1',
          name: 'test2',
        },
      ]);

      await expect(
        validator.assertCanUpdate('2', {
          name: 'test',
        })
      ).rejects.toThrow(
        expectAggregatedInputValidationError(LEVEL_NAME_EXISTS)
      );
    });

    it("doesn't throw if a level with the same name exists in a different schoolyear", async () => {
      setMockRepositoryDataset(mockRepositories.level, [
        {
          id: '1',
          schoolyearId: '1',
          name: 'test',
        },
        {
          id: '2',
          schoolyearId: '2',
          name: 'test',
        },
      ]);

      await expect(
        validator.assertCanUpdate('2', {
          name: 'test',
        })
      ).resolves.toBeUndefined();
    });

    it("doesn't throw if a level with a different name exists in the same schoolyear", async () => {
      setMockRepositoryDataset(mockRepositories.level, [
        {
          id: '1',
          schoolyearId: '1',
          name: 'test',
        },
        {
          id: '2',
          schoolyearId: '1',
          name: 'test2',
        },
      ]);

      await expect(
        validator.assertCanUpdate('1', {
          name: 'test',
        })
      ).resolves.toBeUndefined();
    });
  });
});
