import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMergeTablesComponent } from './user-merge-tables.component';

describe('UserMergeTablesComponent', () => {
  let component: UserMergeTablesComponent;
  let fixture: ComponentFixture<UserMergeTablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserMergeTablesComponent]
    });
    fixture = TestBed.createComponent(UserMergeTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
