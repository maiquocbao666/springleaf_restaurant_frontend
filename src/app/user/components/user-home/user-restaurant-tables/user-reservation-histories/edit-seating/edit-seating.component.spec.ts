import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSeatingComponent } from './edit-seating.component';

describe('EditSeatingComponent', () => {
  let component: EditSeatingComponent;
  let fixture: ComponentFixture<EditSeatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSeatingComponent]
    });
    fixture = TestBed.createComponent(EditSeatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
