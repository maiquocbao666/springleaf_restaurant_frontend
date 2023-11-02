import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription, distinctUntilChanged, map, switchMap } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-user-categories',
  templateUrl: './user-categories.component.html',
  styleUrls: ['./user-categories.component.css']
})
export class UserCategoriesComponent {

  categories: Category[] = [];
  categories$!: Observable<Category[]>;
  searchTerms = new Subject<string>();
  showMore: boolean = false;
  isMobile: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
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
    this.categories$ = this.searchTerms.pipe(
      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((categoryName: string) => this.categoryService.searchCategoriesByName(categoryName)),
    );
    this.search("");
    
  }

  search(term: string): void {
    if (term.trim() === "") {
      // Nếu term trống, gán categories$ bằng một observable chứa danh sách categories
      this.categories$ = this.categoryService.getCategories();
      //this.categories$ = of([]);
    } else {
      // Nếu term không trống, kiểm tra xem term có trong tên các categories hay không
      const searchTerm = term.toLowerCase(); // Chuyển đổi term thành chữ thường để so sánh không phân biệt hoa thường

      this.categories$ = this.categoryService.getCategories().pipe(
        // Sử dụng operator map để lọc các categories thỏa mãn điều kiện
        map(categories => categories.filter(category => category.name.toLowerCase().includes(searchTerm)))
      );

      this.searchTerms.next(term);
    }
  }

  getCategories(): void {
    this.categoryService.getCategories()
      .subscribe(categories => this.categories = categories);
  }



}
