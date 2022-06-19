import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmsdgmEditComponent } from './bpmsdgm-edit.component';

describe('BpmsdgmEditComponent', () => {
  let component: BpmsdgmEditComponent;
  let fixture: ComponentFixture<BpmsdgmEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmsdgmEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmsdgmEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
