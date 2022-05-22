import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgSearchComponent } from './msg-search.component';

describe('MsgSearchComponent', () => {
  let component: MsgSearchComponent;
  let fixture: ComponentFixture<MsgSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
