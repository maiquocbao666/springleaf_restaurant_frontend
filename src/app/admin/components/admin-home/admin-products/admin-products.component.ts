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
    this.getProducts();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getProducts();
  }

  getCategories(): void {
    this.categoryService.getCategories()
      .subscribe(categories => this.categories = categories);
  }

  getProducts(): void {
    this.productService.getProducts()
      .subscribe(products => this.products = products);
  }

  getCategoryById(categoryId: number): Observable<Category | null> {
    return this.categoryService.getCategoryById(categoryId);
  }

  addProduct(): void {
    // Lấy giá trị từ các trường select
    const name = this.productForm.get('name')?.value;
    const unitPrice = this.productForm.get('unitPrice')?.value;
    const description = this.productForm.get('description')?.value;
    const status = this.productForm.get('status')?.value;
    const imageUrl = this.productForm.get('imageUrl')?.value;
    const categoryId = this.productForm.get('categoryId')?.value;
    console.log("Giá trị đâu :" + name);

    // Tạo một đối tượng Inventory và gán giá trị
    const newProduct: Product = {
      menuItemId: 0,
      name: name,
      unitPrice: unitPrice,
      description: description,
      status: status,
      imageUrl: imageUrl,
      categoryId: categoryId,
    };

    this.productService.addProduct(newProduct)
      .subscribe(product => {
        this.getProducts();
        this.productForm.get('status')?.setValue(true);
        this.productForm.reset();
      });

  }

  deleteProduct(product: Product): void {

    if (product.menuItemId) {
      this.products = this.products.filter(c => c !== product);
      this.productService.deleteProduct(product.menuItemId).subscribe();
    } else {
      console.log("Không có menuItemId");
    }


  }
  openProductDetailModal(product: Product) {
    this.getProducts();
    const modalRef = this.modalService.open(AdminProductDetailComponent, { size: 'lg' });
    modalRef.componentInstance.product = product;
  }

}
