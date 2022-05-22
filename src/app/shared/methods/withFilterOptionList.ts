import { ComboItem } from '@interfaces/global.interfaces';

type Constructor<T> = new (...args: any[]) => T;
export function withFilterOptionList<T extends Constructor<{}>>(
  BaseClass: T = class {} as any
) {
  return class extends BaseClass {
    public optionList: any[] = [];
    public selectedItems: any[] = [];
    public optionMainList: ComboItem[] = [];

    filterOptionListBy(condIndex: number) {
      const currentOptions = this.calcCurrentOptions();
      this.addCurrentOptionsToAllSet(currentOptions);
      this.optionList[condIndex + 1] = currentOptions;
    }

    calcCurrentOptions() {
      return this.optionMainList.filter(
        (el) => this.selectedItems.indexOf(el.Id) < 0
      );
    }

    addCurrentOptionsToAllSet(currentOptions) {
      this.selectedItems.forEach((el, elKey) => {
        const currentOption = this.optionMainList.find(
          (option) => option.Id === el
        );

        this.optionList[elKey] = [...currentOptions, currentOption];
      });
    }
    addCurrentOptionToAllSet(option) {
      this.selectedItems.forEach((el, elKey) => {
        this.optionList[elKey] = [...this.optionList[elKey], option];
      });
    }
  };
}
