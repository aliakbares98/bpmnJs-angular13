import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanActivityComponent } from './human-activity.component';

describe('HumanActivityComponent', () => {
  let component: HumanActivityComponent;
  let fixture: ComponentFixture<HumanActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HumanActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
