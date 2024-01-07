import { Component, HostListener } from '@angular/core';
import { Observable, Subject, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-user-categories',
  templateUrl: './user-categories.component.html',
  styleUrls: ['./user-categories.component.css']
})
export class UserCategoriesComponent {

  //categoriesCache$!: Observable<Category[]>;
  categories: Category[] = [];
  searchTerms = new Subject<string>();
  showMore: boolean = false;
  isMobile: boolean = false;

  categoriesUrl = 'categories';

  constructor(
    private categoryService: CategoryService,
  ) {
  }

  chunkArray(array: any[], size: number): any[] {
    const chunkedArr = [];
    let index = 0;
    while (index < array.length) {
      chunkedArr.push(array.slice(index, size + index));
      index += size;
    }
    return chunkedArr;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // Số 768 là ngưỡng tùy chỉnh cho kích thước điện thoại
  }

  ngOnInit(): void {
    console.log("Init User Categories Component");
    this.getCategories();
    this.checkScreenSize();
  }

  search(event: any) {
    const keyword = event.target.value;
    if (keyword.trim() === '') {
      this.getCategories();
    } else {
      this.categoryService.searchByKeywords(keyword).subscribe(
        (data) => {
          this.categories = data.filter(data => data.active === true);
        }
      );
    }
  }

  getCategories(): void {
    this.categoryService.getCache().subscribe(
      (cached: Category[]) => {
        this.categories = cached.filter(category => category.active === true);
      }
    );
  }

  

}
