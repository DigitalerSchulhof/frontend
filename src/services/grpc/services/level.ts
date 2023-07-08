import {
  ListResult,
  SearchOptions,
  TypeFilter,
  WithId,
} from '#/services/interfaces/base';
import { Level, LevelService } from '#/services/interfaces/level';
import {
  BatchGetLevelsRequest,
  CreateLevelRequest,
  DeleteLevelRequest,
  DeleteLevelsWhereRequest,
  GetLevelRequest,
  LevelServiceClient,
  ListLevelsRequest,
  UpdateLevelRequest,
  UpdateLevelsWhereRequest,
} from '@dsh/protocols/dsh/services/level/v1/service';
import { FieldMask } from '@dsh/protocols/google/protobuf/field_mask';
import {
  levelFromJs,
  levelToJs,
} from '../converters/dsh/services/level/v1/resources';
import { GrpcService, filtersToGrpc } from './base';

export class LevelServiceGrpcService
  extends GrpcService<LevelServiceClient>
  implements LevelService
{
  async search(
    options: SearchOptions<Level>
  ): Promise<ListResult<WithId<Level>>> {
    const res = await this.client.ListLevels(
      new ListLevelsRequest({
        limit: options.limit,
        offset: options.offset,
        filter: filtersToGrpc(options.filter),
        order_by: options.order,
      })
    );

    return {
      total: res.meta.total_count,
      items: res.levels.map(levelToJs),
    };
  }

  async get(id: string): Promise<WithId<Level> | null> {
    const res = await this.client.GetLevel(new GetLevelRequest({ id }));

    return levelToJs(res.level);
  }

  async getByIds(ids: readonly string[]): Promise<(WithId<Level> | null)[]> {
    const res = await this.client.BatchGetLevels(
      new BatchGetLevelsRequest({ ids })
    );

    return res.levels.map(levelToJs);
  }

  async create(data: Level): Promise<WithId<Level>> {
    const res = await this.client.CreateLevel(
      new CreateLevelRequest({
        data: levelFromJs(data),
      })
    );

    return levelToJs(res.level);
  }

  async update(id: string, data: Partial<Level>): Promise<WithId<Level>> {
    const res = await this.client.UpdateLevel(
      new UpdateLevelRequest({
        id,
        data: levelFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return levelToJs(res.level);
  }

  async updateWhere(
    filter: TypeFilter<Level>,
    data: Partial<Level>
  ): Promise<WithId<Level>[]> {
    const res = await this.client.UpdateLevelsWhere(
      new UpdateLevelsWhereRequest({
        filter: filtersToGrpc(filter),
        data: levelFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return res.levels.map(levelToJs);
  }

  async delete(id: string): Promise<WithId<Level>> {
    const res = await this.client.DeleteLevel(
      new DeleteLevelRequest({ id })
    );

    return levelToJs(res.level);
  }

  async deleteWhere(filter: TypeFilter<Level>): Promise<WithId<Level>[]> {
    const res = await this.client.DeleteLevelsWhere(
      new DeleteLevelsWhereRequest({
        filter: filtersToGrpc(filter),
      })
    );

    return res.levels.map(levelToJs);
  }
}
