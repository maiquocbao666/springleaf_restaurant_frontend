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

  categoriesCache$!: Observable<Category[]>;
  categories$!: Observable<Category[]>;
  searchTerms = new Subject<string>();
  showMore: boolean = false;
  isMobile: boolean = false;

  constructor(
    private categoryService: CategoryService,
  ) {
    this.getCategories();
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
    this.categories$ = this.searchTerms.pipe(
      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((categoryName: string) => this.categoryService.searchByName(categoryName)),
    );
    this.search("");
  }

  search(term: string): void {
    if (term.trim() === "") {
      // Nếu term trống, gán categories$ bằng một observable chứa danh sách categories
      this.categories$ = this.categoryService.gets();
      //this.categories$ = of([]);
    } else {
      // Nếu term không trống, kiểm tra xem term có trong tên các categories hay không
      const searchTerm = term.toLowerCase(); // Chuyển đổi term thành chữ thường để so sánh không phân biệt hoa thường

      this.categories$ = this.categoryService.gets().pipe(
        // Sử dụng operator map để lọc các categories thỏa mãn điều kiện
        map(categories => categories.filter(category => category.name.toLowerCase().includes(searchTerm)))
      );

      this.searchTerms.next(term);
    }
  }

  getCategories(): void {
    this.categoryService.categoriesCache$.subscribe(categories => {
      this.categories$ = of(categories);
    });
  }



}
