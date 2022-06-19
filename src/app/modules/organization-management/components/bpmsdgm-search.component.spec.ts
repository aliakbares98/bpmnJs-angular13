import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmsdgmSearchComponent } from './bpmsdgm-search.component';

describe('BpmsdgmSearchComponent', () => {
  let component: BpmsdgmSearchComponent;
  let fixture: ComponentFixture<BpmsdgmSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmsdgmSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmsdgmSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
