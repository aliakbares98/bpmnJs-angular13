import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
export function toResponseModel() {
  return pipe(
    map((resp: any) => {
      const result: any = [];
      resp.map((item: any) => {
        result.push({ Id: item.Id, Value: item.Name || item.Value });
      });
      return result;
    })
  );
}
