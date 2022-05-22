import { GroupField } from '@interfaces/global.interfaces';

export function separateGroupValue(data: GroupField[]) {
  let result: { [key: string]: string | number } = {};
  data.map((el: GroupField) => {
    result[`${el.Command}Name`] = el.GroupValueName;
    result[`${el.Command}Id`] = el.GroupValueId;
    result[`${el.Command}RecordStatus`] = el.RecordStatus;
    result[`${el.Command}KeyId`] = el.KeyId;
    result[`${el.Command}Command`] = el.Command;
  });

  return result;
}
