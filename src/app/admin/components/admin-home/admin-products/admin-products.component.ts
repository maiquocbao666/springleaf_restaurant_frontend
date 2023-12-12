import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
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
  isSubmitted = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 20];
  productsUrl = 'products';
  categoriesUrl = 'categories';
  codeCache: string | null = null;
  code: string = '';

  @ViewChild('imageUpload') imageUpload!: ElementRef<HTMLInputElement>;
  @ViewChild('imagePreview') imagePreview!: ElementRef<HTMLImageElement>;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService,
    private http: HttpClient

  ) {
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      unitPrice: new FormControl('', Validators.required),
      categoryId: new FormControl('', Validators.required),
      imageUrl: new FormControl('', Validators.required),
      description: new FormControl(''),
      status: new FormControl(true)
    });
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
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
    this.categoryService.getCache().subscribe(
      (cached: any[]) => {
        this.categories = cached;
      }
    );
  }
  getProducts(): void {
    this.productService.getCache().subscribe(
      (cached: any[]) => {
        this.products = cached;
      }
    );
  }
  getCategoryById(id: number): Category | null {
    const found = this.categories.find(data => data.categoryId === id);
    return found || null;
  }

  addProduct(): void {
    this.isSubmitted = true;
    if (this.productForm.valid) {
      const name = this.productForm.get('name')?.value;
      const unitPrice = this.productForm.get('unitPrice')?.value;
      const description = this.productForm.get('description')?.value;
      const status = this.productForm.get('status')?.value;
      const imageUrl = this.productForm.get('imageUrl')?.value;
      const categoryId = this.productForm.get('categoryId')?.value;
      const imageFile = this.productForm.get('imageUrl')?.value;
      const imageName = imageFile.split('\\').pop();

      const newProduct: Product = {
        name: name,
        unitPrice: unitPrice,
        description: description,
        status: status,
        imageUrl: imageName,
        categoryId: categoryId,
      };
      this.productService.add(newProduct)
        .subscribe(product => {
          this.productForm.get('status')?.setValue(true);
          this.productForm.get('imageUrl')?.setValue(null);
          this.productForm.reset();
          this.onUpload();
          this.sweetAlertService.showCustomAnimatedAlert('Thêm thành công', 'success', 'animated tada');
          this.isSubmitted = false;
        });
    } else {
      this.sweetAlertService.showCustomAnimatedAlert('Thất bại', 'warning', 'Thêm thất bại')
    }
  }

  deleteProduct(product: Product): void {
    if (product.menuItemId) {
      this.sweetAlertService.showConfirmAlert('Bạn có muốn xóa ' + product.name, ' Không thể lưu lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.productService.delete(product.menuItemId!).
              subscribe(() => {
                this.getProducts();
              }),
              Swal.fire('Đã xóa!', 'Bạn đã xóa ' + product.name + ' thành công', 'success');
          }
        })
    } else {
      console.log('Không có mã món');
    }
  }

  openProductDetailModal(product: Product) {
    const modalRef = this.modalService.open(AdminProductDetailComponent, { size: 'lg' });
    modalRef.componentInstance.product = product;
    modalRef.componentInstance.productSaved.subscribe(() => {
    });
  }

  ngAfterViewInit() {
    this.imageUpload.nativeElement.addEventListener('change', (event) => {
      this.readImgUrlAndPreview(event.target!);
    });
  }

  readImgUrlAndPreview(input: EventTarget) {
    const fileInput = input as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview.nativeElement.src = e.target.result;
        this.imagePreview.nativeElement.style.opacity = '1';
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  
  selectedFile: File | undefined;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  onUpload() {
    if (this.selectedFile) {
      this.productService.uploadImage(this.selectedFile)
        .subscribe(response => {
          // Xử lý phản hồi từ server nếu cần
          console.log('Phản hồi từ server:', response);
        }, error => {
          // Xử lý lỗi nếu có
          console.error('Lỗi khi tải lên:', error);
        });
    }
  }


}
