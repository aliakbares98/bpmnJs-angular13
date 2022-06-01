import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProcessInformationComponent } from './add-process-information.component';

describe('AddProcessInformationComponent', () => {
  let component: AddProcessInformationComponent;
  let fixture: ComponentFixture<AddProcessInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProcessInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProcessInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
