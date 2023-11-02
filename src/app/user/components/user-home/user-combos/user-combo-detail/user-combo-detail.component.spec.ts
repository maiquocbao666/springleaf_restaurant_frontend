import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComboDetailComponent } from './user-combo-detail.component';

describe('UserComboDetailComponent', () => {
  let component: UserComboDetailComponent;
  let fixture: ComponentFixture<UserComboDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserComboDetailComponent]
    });
    fixture = TestBed.createComponent(UserComboDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
