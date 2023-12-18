import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBillHistoriesComponent } from './user-bill-histories.component';

describe('UserBillHistoriesComponent', () => {
  let component: UserBillHistoriesComponent;
  let fixture: ComponentFixture<UserBillHistoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserBillHistoriesComponent]
    });
    fixture = TestBed.createComponent(UserBillHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
