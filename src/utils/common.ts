const findItemNested = (
  arr: any,
  itemKey: string,
  itemId: string,
  nestingKey: string
) =>
  arr.reduce((acc: any, item: any) => {
    if (acc) return acc;
    if (item[itemKey] === itemId) return item;
    if (item[nestingKey])
      return findItemNested(item[nestingKey], itemKey, itemId, nestingKey);
  }, null);

export { findItemNested };
