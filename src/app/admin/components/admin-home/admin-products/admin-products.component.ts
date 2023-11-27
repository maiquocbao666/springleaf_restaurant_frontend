import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { AdminProductDetailComponent } from './admin-product-detail/admin-product-detail.component';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent {
  product: Product | undefined;
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];
  productsUrl = 'products';
  categoriesUrl = 'categories';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      unitPrice: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      status: [, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  getCategories(): void { 
    this.categoryService.gets();
    this.categoryService.cache$
      .subscribe(categories => {
        this.categoryService.gets();
        this.categories = JSON.parse(localStorage.getItem(this.categoriesUrl) || 'null');
      });
  }

  getProducts(): void {
    this.productService.gets();
    this.productService.cache$
      .subscribe(products => {
        this.productService.gets();
        this.products = JSON.parse(localStorage.getItem(this.productsUrl) || 'null');
      });
  }

  getCategoryById(categoryId: number): Observable<Category | null> {
    return this.categoryService.getById(categoryId);
  }

  addProduct(): void {
    // Lấy giá trị từ các trường select
    const name = this.productForm.get('name')?.value;
    const unitPrice = this.productForm.get('unitPrice')?.value;
    const description = this.productForm.get('description')?.value;
    const status = this.productForm.get('status')?.value;
    const imageUrl = this.productForm.get('imageUrl')?.value;
    // Thay đổi cách truy cập giá trị categoryId
    const categoryId = this.productForm.get('categoryId')?.value;
    console.log("Giá trị đâu :" + name);

    // Tạo một đối tượng Inventory và gán giá trị
    const newProduct: Product = {
      name: name,
      unitPrice: unitPrice,
      description: description,
      status: status,
      imageUrl: imageUrl,
      categoryId: categoryId,
    };
    this.productService.add(newProduct)
      .subscribe(product => {
        this.productForm.get('status')?.setValue(true);
        this.productForm.reset();
      });
  }

  deleteProduct(product: Product): void {

    if (product.menuItemId) {
      this.productService.delete(product.menuItemId).subscribe();
    } else {
      console.log("Không có menuItemId");
    }

  }
  openProductDetailModal(product: Product) {
    const modalRef = this.modalService.open(AdminProductDetailComponent, { size: 'lg' });
    modalRef.componentInstance.product = product;

    // Subscribe to the emitted event
    modalRef.componentInstance.productSaved.subscribe(() => {
    });

  }

}
