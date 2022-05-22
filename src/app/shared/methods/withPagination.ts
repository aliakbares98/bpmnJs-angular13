import { environment } from '@env/environment';
import { SliceData } from '@interfaces/global.interfaces';

type Constructor<T> = new (...args: any[]) => T;
export function withPagination<T extends Constructor<{}>>(
  BaseClass: T = class {} as any
) {
  return class extends BaseClass {
    // .........  Pagination Property ......//
    perPageSet = environment.settings.perPageSet;
    public _perPage = 12;
    public _pageNo = 1;
    public _count!: number;

    // ........... Filter Property ...........//
    public showList: any;
    public filterList: any;
    public mainList: any;

    public sortedData = [];

    setPerpage(perPage: number) {
      this._count = this.filterList.length;
      const list = [...this.filterList];
      this._perPage = perPage;
      const sliceArg = {
        items: list,
        pageNo: 1,
        perPage: this.perPage,
      };

      this.showList = this.sortedData = this.sliceData(sliceArg);
    }

    // ------ pagination -------------

    get pageNo() {
      return this._pageNo;
    }
    get perPage() {
      return this._perPage;
    }

    get count() {
      return this._count;
    }

    get pageCount() {
      return Math.ceil(this.count / this.perPage);
    }

    goPage(pageNo: number) {
      this._pageNo = pageNo;
      const list = [...this.filterList];
      const sliceArg = {
        items: list,
        pageNo: pageNo,
        perPage: this.perPage,
      };

      this.showList = this.sliceData(sliceArg);
    }

    sliceData(arg: SliceData) {
      let pageNo = arg.pageNo;
      const perPage = arg.perPage;
      const items = arg.items ? arg.items : [];

      if (pageNo <= 0 || Number.isNaN(pageNo) || pageNo == null) {
        pageNo = 1;
      }

      const startIndex = (pageNo - 1) * perPage;
      const endIndex = startIndex + perPage;
      if (items.length > 0) {
        return items.slice(startIndex, endIndex);
      }

      return null;
    }

    get rowStartNumber() {
      return (this._pageNo - 1) * this.perPage;
    }

    trackByFn(index: number, el: any): number {
      return el.Id;
    }

    getcurrentPage(index: number) {
      if (index < this.perPage) {
        return 1;
      }

      let current = Math.ceil((index + 1) / this.perPage);
      const last = Math.ceil(this.filterList.length / this.perPage);

      if (last < current) {
        current = last;
      }

      return current;
    }
  };
}
