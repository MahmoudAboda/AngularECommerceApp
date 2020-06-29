import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products:Product[]=[];
  currentCategoryId:number=1;
  previousCategoryID:number=1;
  searchMode:boolean =false;

  //new properties for pagination
  thePageNumber:number=1;
  thePageSize:number=5;
  theTotalElements:number=0;

  previousKeyword:string=null;

  constructor(private productService:ProductService,
    private cartService:CartService
    ,private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(()=>{
    this.ListProducts();

  });
}
  ListProducts(){
    this.searchMode=this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
  this.handleSearchProducts();
}
    else{
      this.handleListProducts();
    }
  }
  handleSearchProducts(){
    const thekeyword:string=this.route.snapshot.paramMap.get('keyword');



    if(this.previousKeyword !=thekeyword){
      this.thePageNumber=1;
    }
    this.previousKeyword=thekeyword;
    console.log(`keyword=${thekeyword},thePageNumber=${this.thePageNumber}`);


    this.productService.searchProductsPaginate(this.thePageNumber-1,
                                          this.thePageSize,
                                          thekeyword).subscribe(this.processResult());
      }
    
  

  handleListProducts(){


    const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      this.currentCategoryId=+this.route.snapshot.paramMap.get('id');
    }
    else{this.currentCategoryId=1;}


    if(this.previousCategoryID !=this.currentCategoryId){
      this.thePageNumber=1;
    }


    this.previousCategoryID =this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId},thePageNumber=${this.thePageNumber}`);


  this.productService.getProductListPaginate(this.thePageNumber -1,
                                                    this.thePageSize,
                                                    this.currentCategoryId)
                                                    .subscribe(this.processResult());
  
    }
      processResult(){
        return data =>{
          this.products=data._embedded.products;
          this.thePageNumber=data.page.number+1;
          this.thePageSize=data.page.size;
          this.theTotalElements=data.page.totalElements;
        };
      }

      updatePageSize(pageSize:number){
        this.thePageSize=pageSize;
        this.thePageNumber=1;
        this.ListProducts();
      }

      addToCart(theProduct:Product){
        console.log(`Adding to cart : ${theProduct.name},${theProduct.unitPrice}`);
        
        const theCartItem=new CartItem(theProduct);
        this.cartService.addToCart(theCartItem);
      }
  
  }

