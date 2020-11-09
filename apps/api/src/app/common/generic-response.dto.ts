export interface GenericResponseDto<Entity> {
  items: Entity[];
  hasNext: boolean;
}

export async function createPaginationResponse(itemsPromise: Promise<any>) {
  const items = await itemsPromise;
  return { items, hasNext: true };
}
