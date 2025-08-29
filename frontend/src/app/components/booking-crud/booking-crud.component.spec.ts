import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingCrudComponent } from './booking-crud.component';

describe('BookingCrudComponent', () => {
  let component: BookingCrudComponent;
  let fixture: ComponentFixture<BookingCrudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingCrudComponent]
    });
    fixture = TestBed.createComponent(BookingCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
