import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnChanges {
  @Input('maxPositions') maxPos = 5;
  @Input('count') count!: number;
  @Input('currentPage') currentPage!: number;
  @Input('perPage') perPage: number = 10;
  @Input('disabledMode') disabledMode = false;

  @Output('goPage') goPage = new EventEmitter<any>(true);

  // pager object
  paginate: any = {};
  totalPages!: number;
  pages: number[] = [];
  noData = false;

  startPage = 1;
  pageOne = true;

  activatedRoute!: string;

  constructor() {}

  ngOnChanges() {
    if (!this.count) return;

    if (!this.currentPage) return;

    this.calculate();
  }

  calculate() {
    if (this.count == 0) {
      this.noData = true;
      this.pages = [];
      return;
    }

    this.noData = false;
    this.totalPages = Math.ceil(this.count / this.perPage);
    this.genPaginate();
  }

  genPaginate() {
    let startPosition: number;
    let maxPositions = this.maxPos;

    if (this.currentPage > this.totalPages) return;

    let midWay = Math.round(maxPositions / 2);

    startPosition = 1 + (this.currentPage - midWay);
    if (this.currentPage <= midWay) {
      startPosition = 1;
    }

    if (this.totalPages - 1 - this.currentPage < midWay) {
      startPosition = this.totalPages - maxPositions;
    }
    if (this.totalPages <= maxPositions) {
      startPosition = 1;
      maxPositions = this.totalPages - 1; //add -1
    }

    let pos = 0;
    let tempPages: number[] = [];

    for (
      let idx: number = startPosition;
      idx - startPosition < maxPositions;
      idx++
    ) {
      tempPages[pos] = idx;
      pos++;
    }

    this.pages = tempPages;
  }

  setPage(pageNo: number) {
    if (pageNo < 1 || pageNo > this.paginate.totalPage) {
      return;
    }

    if (pageNo >= 1 && this.currentPage !== pageNo) {
      this.pageOne = false;
      this.currentPage = pageNo;

      this.goPage.emit(pageNo);
      this.runPaginate(pageNo);
    }
  }

  runPaginate(pageNo: number) {
    this.startPage = this.paginate.startPage;
  }

  get isFirstPage() {
    return this.currentPage == 1;
  }

  get isLastPage() {
    return this.currentPage == this.totalPages;
  }

  get noResult() {
    return this.pages.length == 0;
  }
}
