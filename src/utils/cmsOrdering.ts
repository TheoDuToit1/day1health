export type CmsOrderableRow = Record<string, any>;

const getNumericOrderValue = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return Number.MAX_SAFE_INTEGER;
};

export const getCmsDisplayOrder = (row: CmsOrderableRow): number =>
  getNumericOrderValue(row.page_order ?? row.sort_order);

export const sortCmsRowsByDisplayOrder = <T extends CmsOrderableRow>(rows: T[]): T[] =>
  rows
    .map((row, index) => ({
      row,
      index,
      order: getCmsDisplayOrder(row),
    }))
    .sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order;
      }

      return left.index - right.index;
    })
    .map(({ row }) => row);
