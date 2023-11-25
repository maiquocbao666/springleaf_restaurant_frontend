import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, catchError, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Category } from '../interfaces/category';
import { RxStompService } from '../rx-stomp.service';
import { Message } from '@stomp/stompjs';
import { ProductService } from './product.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private receivedMessages: string[] = [];
  private topicSubscription: Subscription | undefined;  // Use Subscription or undefined
  private categoriesUrl = 'categories';
  private categoryUrl = 'category';
  private channel = 'public'

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private categoriesCacheSubject = new BehaviorSubject<Category[]>([]);
  categoriesCache$ = this.categoriesCacheSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private rxStompService: RxStompService,
    private productService: ProductService,
    private sweetAlertService: ToastService,
  ) {
    this.topicSubscription = this.rxStompService.connectionState$.subscribe(state => {
      console.log('WebSocket Connection State:', state);

      if (state === 0) {
        if (this.channel === "public") {
          this.subscribeToQueue();
        } else if (this.channel === "private") {
          //console.log("Subscribe to socket private");
        }
      }
    });
  }

  ngOnInit(): void {
    this.gets();
  }

  private subscribeToQueue() {
    this.topicSubscription = this.rxStompService
      .watch(`/${this.channel}/greetings`)
      .subscribe((message: Message) => {
        console.log("Raw message body:", message.body);

        try {
          const messageData = JSON.parse(message.body);

          if (messageData.name === this.categoriesUrl && Array.isArray(messageData.objects)) {

            this.categoriesCache = messageData.objects;
            this.gets();
            localStorage.setItem(this.categoriesUrl, JSON.stringify(this.categoriesCache));

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

    if (this.channel === "public") {
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

  gets(): Observable<Category[]> {

    if (this.categoriesCache) {
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

  getById(id: number): Observable<Category | null> {

    if (!id) {
      return of(null);
    }

    if (!this.categoriesCache.length) {

      this.gets();

    }

    const cache = this.categoriesCache.find(category => category.categoryId === id);

    if (cache) {

      return of(cache);

    } else {

      const url = `${this.categoryUrl}/${id}`;
      return this.apiService.request<Category>('get', url);

    }

  }

  private isInCache(name: string, categoryIdToExclude: number | null = null): boolean {
    const isCategoryInCache = this.categoriesCache?.some(
      (cache) =>
        cache.name.toLowerCase() === name.toLowerCase() && cache.categoryId !== categoryIdToExclude
    );

    if (isCategoryInCache) {
      this.sweetAlertService.showTimedAlert('Category này đã có rồi!', '', 'error', 2000);
    }

    return isCategoryInCache || false;
  }

  add(newCategory: Category): Observable<Category> {
    // Kiểm tra xem danh sách categoriesCache đã được tải hay chưa
    if (this.categoriesCache) {

      // Nếu đã có danh mục cùng tên, trả về Observable với giá trị hiện tại
      if (this.isInCache(newCategory.name)) {
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

  update(updated: Category): Observable<any> {
    if (this.categoriesCache) {
      // Kiểm tra xem danh sách categoriesCache đã được tải hay chưa
      if (this.isInCache(updated.name, updated.categoryId)) {
        return of();
      }
    }

    const url = `${this.categoryUrl}`;

    return this.apiService.request('put', url, updated).pipe(
      tap(() => {
        const updatedCategories = this.categoriesCache.map((category) =>
          category.categoryId === updated.categoryId ? updated : category
        );
        this.categoriesCache = updatedCategories;
        localStorage.setItem(this.categoriesUrl, JSON.stringify(updatedCategories));
        this.onSendMessage(this.categoriesUrl);
      })
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.categoryUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        // Xóa category khỏi categoriesCache
        const updatedCategories = this.categoriesCache.filter(cache => cache.categoryId !== id);
        this.categoriesCache = updatedCategories;
        localStorage.setItem(this.categoriesUrl, JSON.stringify(updatedCategories));
        this.onSendMessage(this.categoriesUrl);
      })
    );
  }

  searchByName(term: string): Observable<Category[]> {
    if (!term.trim()) {
      return of([]);
    }

    if (this.categoriesCache) {
      const filtered = this.categoriesCache.filter(cache => {
        return cache.name.toLowerCase().includes(term.toLowerCase());
      });

      if (filtered) {
        return of(filtered);
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