import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCombosComponent } from './user-combos.component';

describe('UserComboComponent', () => {
  let component: UserCombosComponent;
  let fixture: ComponentFixture<UserCombosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCombosComponent]
    });
    fixture = TestBed.createComponent(UserCombosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
