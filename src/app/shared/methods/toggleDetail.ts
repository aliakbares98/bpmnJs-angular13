export function toggleDetail(cond: any) {
  if (cond) {
    return { display: 'block' };
  }
  return { display: 'none' };
}
