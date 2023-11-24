import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, catchError, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Category } from '../interfaces/category';
import { RxStompService } from '../rx-stomp.service';
import { Message } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private receivedMessages: string[] = [];
  private topicSubscription: Subscription | undefined;  // Use Subscription or undefined
  private categoriesUrl = 'categories';
  private categoryUrl = 'category';
  private channel = 'queu'

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private categoriesCacheSubject = new BehaviorSubject<Category[]>([]);
  categoriesCache$ = this.categoriesCacheSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private rxStompService: RxStompService,
  ) {
    this.rxStompService.connectionState$.subscribe(state => {
      console.log('WebSocket Connection State:', state);

      if (state === 0) {
        if (this.channel === "queu") {
          this.subscribeToQueue();
        } else if (this.channel === "topic") {

        }
      }
    });
  }

  ngOnInit(): void {

  }

  private subscribeToQueue() {
    this.rxStompService
      .watch(`/${this.channel}/greetings`)
      .subscribe((message: Message) => {
        console.log("Raw message body:", message.body);
        
        try {
          const messageData = JSON.parse(message.body);
  
          if (messageData.name === 'categories' && Array.isArray(messageData.objects)) {
    
            this.categoriesCache = messageData.objects;
            this.getCategories();
  
          } else {
            console.error("Invalid message format. Unexpected 'name' or 'objects' format.");
          }
        } catch (error) {
          console.error("Error parsing JSON from message body:", error);
        }
      });
  }

  private onSendMessage(name: string) {
    // if (!this.user) {
    //   return;
    // }

    if (this.channel === "queu") {
      const messageBody = {
        name: name,
        objects: this.categoriesCache  // Thêm categoriesCache vào message body
      };
      this.rxStompService.publish({ destination: `/app/${this.channel}`, body: JSON.stringify(messageBody) });
    }

  }

  get categoriesCache(): Category[] {
    return this.categoriesCacheSubject.value;
  }

  set categoriesCache(value: Category[]) {
    this.categoriesCacheSubject.next(value);
  }

  getCategories(): Observable<Category[]> {
    if (this.categoriesCache.length > 0) {
      return of(this.categoriesCache);
    }

    const categoriesObservable = this.apiService.request<Category[]>('get', this.categoriesUrl);

    categoriesObservable.subscribe(data => {

      if (this.categoriesCache !== data) {
        this.categoriesCache = data;
        return categoriesObservable;
      } else {
        return of(this.categoriesCache);
      }

    });

    return categoriesObservable;
  }

  getCategoryById(id: number): Observable<Category | null> {

    if (!id) {
      return of(null);
    }

    if (!this.categoriesCache.length) {

      this.getCategories();

    }

    const categoryFromCache = this.categoriesCache.find(category => category.categoryId === id);

    if (categoryFromCache) {

      return of(categoryFromCache);

    } else {

      const url = `${this.categoryUrl}/${id}`;
      return this.apiService.request<Category>('get', url);

    }

  }

  private isCategoryNameInCache(name: string): boolean {
    const isTrue = this.categoriesCache?.some(category => category.name.toLowerCase() === name.toLowerCase()) || false;
    if (isTrue) {
      console.log("Danh mục này đã có rồi");
      return isTrue;
    } else {
      return isTrue;
    }
  }

  addCategory(newCategory: Category): Observable<Category> {
    // Kiểm tra xem danh sách categoriesCache đã được tải hay chưa
    if (this.categoriesCache.length > 0) {

      // Nếu đã có danh mục cùng tên, trả về Observable với giá trị hiện tại
      if (this.isCategoryNameInCache(newCategory.name)) {
        return of();
      }
    }

    // Nếu không có danh mục cùng tên trong cache, tiếp tục thêm danh mục mới
    return this.apiService.request<Category>('post', this.categoryUrl, newCategory).pipe(
      tap((addedCategory: Category) => {
        this.categoriesCache = [...this.categoriesCache, addedCategory];
        localStorage.setItem(this.categoriesUrl, JSON.stringify(this.categoriesCache));
        this.onSendMessage(this.categoriesUrl);
      })
    );
  }

  updateCategory(updatedCategory: Category): Observable<any> {
    if (this.categoriesCache.length > 0) {
      // Kiểm tra xem danh sách categoriesCache đã được tải hay chưa
      if (this.isCategoryNameInCache(updatedCategory.name)) {
        return of();
      }
    }

    const url = `${this.categoryUrl}`;

    return this.apiService.request('put', url, updatedCategory).pipe(
      tap(() => {
        const updatedCategories = this.categoriesCache.map(category =>
          category.categoryId === updatedCategory.categoryId ? updatedCategory : category
        );
        this.categoriesCache = updatedCategories;
        localStorage.setItem(this.categoriesUrl, JSON.stringify(updatedCategories));
        this.onSendMessage(this.categoriesUrl);
      })
    );
  }

  deleteCategory(id: number): Observable<any> {
    const url = `${this.categoryUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        const updatedCategories = this.categoriesCache.filter(category => category.categoryId !== id);
        this.categoriesCache = updatedCategories;
        localStorage.setItem(this.categoriesUrl, JSON.stringify(updatedCategories));
        this.onSendMessage(this.categoriesUrl);
      })
    );
  }

  searchCategoriesByName(term: string): Observable<Category[]> {
    if (!term.trim()) {
      return of([]);
    }

    if (this.categoriesCache.length > 0) {
      const filteredCategories = this.categoriesCache.filter(category => {
        return category.name.toLowerCase().includes(term.toLowerCase());
      });

      if (filteredCategories.length > 0) {
        return of(filteredCategories);
      }
    }

    return this.apiService.request("get", this.categoriesUrl).pipe(
      tap({
        next: (response: any) => {
          // Assuming the response here is an array of Category
          this.categoriesCache = response as Category[];
        },
        error: (error: any) => {
          console.error(error);
        }
      }),
      catchError((error: any) => {
        console.error(error);
        return of([]);
      }),
      map((response: any) => response as Category[])
    );
  }

}