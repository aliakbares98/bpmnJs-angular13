import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
export function toResponseProduct() {
  return pipe(
    map((resp: any) => {
      const result: any = [];
      resp.map((item) => {
        result.push({
          Id: item?.Id,
          Value: item?.Name,
          Code: item?.Code,
          SupplierName: item?.SupplierName,
        });
      });
      return result;
    })
  );
}
