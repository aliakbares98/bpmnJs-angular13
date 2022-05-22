export function toUniqueAndSorted(input) {
  return input
    .filter((item: any) => item)
    .filter(
      (item: any, index: number, self: any) =>
        index === self.findIndex((t: any) => t.name === item.name)
    )
    .sort((a: any, b: any) => {
      return a.order - b.order;
    });
}
