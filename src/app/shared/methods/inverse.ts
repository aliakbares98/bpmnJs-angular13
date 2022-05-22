export function inverse(obj: any) {
  var retobj: any = {};
  for (var key in obj) {
    retobj[obj[key]] = key;
  }
  return retobj;
}
