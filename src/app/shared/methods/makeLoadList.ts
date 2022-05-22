export function makeLoadList(data: any) {
  if (data.length > 0) {
    const listSet: any = [];
    data.map((item: any) => {
      let el;
      if (item.ObjectName && item.ColumnKeyName && item.ColumnKeyValue) {
        el = {
          Id: item.Id,
          Value: item.Value,
          ObjectName: item.ObjectName,
          ColumnKeyName: item.ColumnKeyName,
          ColumnKeyValue: item.ColumnKeyValue,
        };
      } else if (item.ParentId) {
        el = {
          Id: item.Id,
          Value: item.Value || item.Name,
          ParentId: item.ParentId,
        };
      } else {
        el = { Id: item.Id, Value: item.Value || item.Name, Code: item?.Code };
      }
      if (typeof listSet[item.Model] !== 'undefined') {
        listSet[item.Model] = [...listSet[item.Model], el];
      } else {
        listSet[item.Model] = [el];
      }
    });

    return listSet;
  }
}
