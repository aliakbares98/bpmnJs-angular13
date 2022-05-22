import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgShowComponent } from './msg-show.component';

describe('MsgShowComponent', () => {
  let component: MsgShowComponent;
  let fixture: ComponentFixture<MsgShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
