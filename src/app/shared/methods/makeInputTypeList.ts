import { ValidationSet } from '@interfaces/global.interfaces';

export function makeInputTypeList(data: ValidationSet[]) {
  if (data.length > 0) {
    const listSet: any = [];
    data.map((item: any) => {
      listSet[item.ObjectCollectionModelName] = item.ColumnTypeName;
    });

    return listSet;
  }
}
