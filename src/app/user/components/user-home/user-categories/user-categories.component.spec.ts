import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCategoriesComponent } from './user-categories.component';

describe('UserCategoriesComponent', () => {
    let component: UserCategoriesComponent;
    let fixture: ComponentFixture<UserCategoriesComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [UserCategoriesComponent]
        });
        fixture = TestBed.createComponent(UserCategoriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});