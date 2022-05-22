import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDiagramsComponent } from './show-diagrams.component';

describe('ShowDiagramsComponent', () => {
  let component: ShowDiagramsComponent;
  let fixture: ComponentFixture<ShowDiagramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowDiagramsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDiagramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
