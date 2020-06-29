import {Product} from './product';
import { ThrowStmt } from '@angular/compiler';
export class CartItem {
    id:String;
    name:String;
    imageUrl:String;
    unitPrice:number;
    quantity:number;

    constructor(product:Product){
        this.id=product.id;
        this.name=product.name;
        this.imageUrl=product.imageUrl;
        this.unitPrice=product.unitPrice;
        this.quantity=1;

    }
}
