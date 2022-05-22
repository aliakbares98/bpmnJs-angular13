import { environment } from '@env/environment';
import { SliceData, ComboItem } from '@interfaces/global.interfaces';

type Constructor<T> = new (...args: any[]) => T;
export function withArrFilterOptionList<T extends Constructor<{}>>(
  BaseClass: T = class {} as any
) {
  return class extends BaseClass {
    public optionList: any[][] = [];
    public selectedItems: any[][] = [];
    optionMainList: ComboItem[] = [];

    filterOptionListBy(parentIndex: number, childIndex: number) {
      const currentOptions = this.calcCurrentOptions(parentIndex);
      this.addCurrentOptionsToAllSet(currentOptions, parentIndex);
      this.optionList[parentIndex][childIndex + 1] = currentOptions;
    }

    calcCurrentOptions(parentIndex: number) {
      return this.optionMainList.filter(
        (el) => this.selectedItems[parentIndex].indexOf(el.Id) < 0
      );
    }

    addCurrentOptionsToAllSet(currentOptions, parentIndex: number) {
      this.selectedItems[parentIndex].forEach((el, elKey) => {
        const currentOption = this.optionMainList.find(
          (option) => option.Id === el
        );

        this.optionList[parentIndex][elKey] = [
          ...currentOptions,
          currentOption,
        ];
      });
    }
    addCurrentOptionToAllSet(option, parentIndex) {
      this.selectedItems[parentIndex].forEach((el, elKey) => {
        this.optionList[parentIndex][elKey] = [
          ...this.optionList[parentIndex][elKey],
          option,
        ];
      });
    }
  };
}
