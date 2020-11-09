import { FindManyOptions } from 'typeorm';

export interface GenericFilterDto<Entity> {
  page: number;
  pageSize: number;
  search: string;
  (arg: Entity): Partial<Entity>;
}

export function mapQuery<T>(filter?: GenericFilterDto<T>, elasticSearchAttrs?: string[]) {
  return filter.search ? mapElasticQuery(elasticSearchAttrs, filter) : mapDefaultQuery({ where: filter });
}

function mapDefaultQuery(options): FindManyOptions {
  if (options.where.page && options.where.pageSize) {
    options.skip = (options.where.page - 1) * options.where.pageSize;
    options.take = options.where.pageSize;
  }

  delete options.where.page;
  delete options.where.pageSize;
  return options;
}

function mapElasticQuery(attributes: string[], options): FindManyOptions {
  const where = attributes.map((a) => ({ [a]: options.search }));
  return { ...mapDefaultQuery({ where: options }), where };
}
