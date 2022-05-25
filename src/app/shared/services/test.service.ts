import { filter } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { DiagramDTO } from "@sharedMod/models/diagram.dto";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private dataSource$ = new BehaviorSubject<DiagramDTO[]>([]);

  data: Observable<DiagramDTO[]> = this.dataSource$.asObservable();


  getId: DiagramDTO[] = [];
  private nextId = '';
  constructor() { }


  loadAll(id: DiagramDTO[]) {
    this.dataSource$.next(id)
  }

  getData(): DiagramDTO[] {
    return this.dataSource$.getValue();
  }


  create(id: DiagramDTO) {
    this.getId.push(id);
    this.dataSource$.next(Object.assign([], this.getId));

    const preID = this.getData().filter((id) => {
      id.id !== id.id
    });

    const newShape = [...preID, id];
    this.loadAll(newShape)
  }
  
}
