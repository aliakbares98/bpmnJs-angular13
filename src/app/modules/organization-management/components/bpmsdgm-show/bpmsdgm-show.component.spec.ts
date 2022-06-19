import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmsdgmShowComponent } from './bpmsdgm-show.component';

describe('BpmsdgmShowComponent', () => {
  let component: BpmsdgmShowComponent;
  let fixture: ComponentFixture<BpmsdgmShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmsdgmShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmsdgmShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
