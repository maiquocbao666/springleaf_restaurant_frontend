import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Category } from "src/app/interfaces/category";
import { Product } from "src/app/interfaces/product";
import { ProductDiscount } from "src/app/interfaces/product-discounts";
import { CategoryService } from "src/app/services/category.service";
import { ProductDiscountService } from "src/app/services/product-discount.service";
import { ProductService } from "src/app/services/product.service";
import { ToastService } from "src/app/services/toast.service";
import Swal from "sweetalert2";
import { AdminProductDetailComponent } from "../admin-product-detail/admin-product-detail.component";
import { User } from "src/app/interfaces/user";
import { UserService } from "src/app/services/user.service";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
    selector: 'app-admin-product-discounts',
    templateUrl: './admin-product-discounts.component.html',
    styleUrls: ['./admin-product-discounts.component.css']
})
export class AdminProductDiscountsComponent {

    user : User | null = null;
    products: Product[] = [];
    productDiscount: ProductDiscount[] = [];
    discountInfo : DiscountProductInfo[] = []
    categories: Category[] = [];
    productForm: FormGroup;
    productDiscountForm: FormGroup;

    isSubmitted = false;
    page: number = 1;
    count: number = 0;
    tableSize: number = 5;
    tableSizes: any = [5, 10, 15, 20];

    @ViewChild('imageUpload') imageUpload!: ElementRef<HTMLInputElement>;
    @ViewChild('imagePreview') imagePreview!: ElementRef<HTMLImageElement>;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        private toast: ToastService,
        private productDiscountService: ProductDiscountService,
        private authService : AuthenticationService,
    ) {
        this.authService.getUserCache().subscribe((data) => {
            this.user = data;
            if (this.user != null) {
            }
          });

        this.productForm = new FormGroup({
            name: new FormControl('', Validators.required),
            unitPrice: new FormControl('', Validators.required),
            categoryId: new FormControl('', Validators.required),
            imageUrl: new FormControl('', Validators.required),
            description: new FormControl(''),
            status: new FormControl(true)
        });

        this.productDiscountForm = new FormGroup({
            menuItemId: new FormControl('', Validators.required),
            discountValue: new FormControl('', Validators.required),
            startDate: new FormControl('', Validators.required),
            endDate: new FormControl('', Validators.required),
        });
    }

    ngOnInit(): void {
        this.getProducts();
        this.getProductDiscounts();
        this.setDiscountInfo();
        console.log(this.products);
        console.log(this.productDiscount);
        console.log(this.discountInfo);
    }

    getProducts(): void {
        this.productService.getCache().subscribe(
            (cached: any[]) => {
                this.products = cached;
            }
        );
    }

    getProductDiscounts(): void {
        this.productDiscountService.getCache().subscribe(
            (cached: any[]) => {
                this.productDiscount = cached;
                
            }
        );
    }

    setDiscountInfo(){
        for(let discount of this.productDiscount){
            for(let product of this.products){
                if(discount.menuItemId === product.menuItemId){
                    let newDiscount : DiscountProductInfo = {
                        productDiscountId : discount.productDiscountId,
                        discountValue : discount.discountValue,
                        restaurantId : discount.restaurantId,
                        menuItemId : product.menuItemId,
                        startDate : discount.startDate,
                        endDate : discount.endDate,
                        productName : product.name,
                        imageUrl : product.imageUrl,
                        unitPrice : product.unitPrice,
                        active : discount.active
                    }
                    this.discountInfo.push(newDiscount);
                }
            }
        }
    }

    formatAmount(amount: number): string {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    onTableDataChange(event: any) {
        this.page = event;
    }

    onTableSizeChange(event: any): void {
        this.tableSize = event.target.value;
        this.page = 1;
    }

    searchProducts() {
        if (this.keywords.trim() === '') {
            this.getProducts();
        } else {
            this.productService.searchByKeywords(this.keywords, this.fieldName).subscribe(
                (data) => {
                    this.products = data;
                }
            );
        }
    }

    fieldName!: keyof Product;
    changeFieldName(event: any) {
        this.fieldName = event.target.value;
        this.searchProducts();
    }

    keywords = '';
    changeSearchKeyWords(event: any) {
        this.keywords = event.target.value;
        this.searchProducts();
    }

    getCategoryById(id: number): Category | null {
        const found = this.categories.find(data => data.categoryId === id);
        return found || null;
    }

    addProductDiscount(): void {
        this.isSubmitted = true;
        if (this.productDiscountForm.valid) {
            const menuItemId = this.productDiscountForm.get('menuItemId')?.value;
            const restaurantId = this.user?.restaurantBranchId;
            const discountValue = this.productDiscountForm.get('discountValue')?.value;
            const startDate = this.productDiscountForm.get('startDate')?.value;
            const endDate = this.productDiscountForm.get('endDate')?.value;

            const newProductDiscount: ProductDiscount = {
                menuItemId : menuItemId,
                restaurantId : restaurantId!,
                discountValue : discountValue,
                startDate : startDate,
                endDate : endDate,
                active : true,
            };
            this.productDiscountService.add(newProductDiscount)
                .subscribe(productDiscount => {
                    this.toast.showCustomAnimatedAlert('Thêm thành công', 'success', 'animated tada');
                    this.isSubmitted = false;
                });
        } else {
            this.toast.showCustomAnimatedAlert('Thất bại', 'warning', 'Thêm thất bại')
        }
    }

    deleteProductDiscount(product: DiscountProductInfo): void {
        if (product.productDiscountId) {
            this.toast.showConfirmAlert('Bạn có muốn xóa ' + product.productName, ' Không thể lưu lại!', 'warning')
                .then((result) => {
                    if (result.isConfirmed) {
                        this.productDiscountService.delete(product.productDiscountId!).
                            subscribe(() => {
                                this.setDiscountInfo();
                            }),
                            Swal.fire('Đã xóa!', 'Bạn đã xóa ' + product.productName + ' thành công', 'success');
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

    sort(field: keyof Product, ascending: boolean): void {
        this.productService
            .sortEntities(this.products, field, ascending)
            .subscribe(
                (data) => {
                    this.products = data;
                },
                (error) => {
                    // Handle error if necessary
                }
            );
    }

}

export interface DiscountProductInfo{
    productDiscountId?  : number;
    menuItemId : number;
    restaurantId : number;
    discountValue : number;
    startDate : string;
    endDate : string ;
    active : boolean ;
    productName : string;
    imageUrl : string;
    unitPrice : number;
}