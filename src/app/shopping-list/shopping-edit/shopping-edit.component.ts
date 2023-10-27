import { Component, ElementRef,ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent {

  @ViewChild('nameInput',{static:true}) nameRef:ElementRef;
  @ViewChild('amountInput',{static:true}) amountRef:ElementRef;
  
  constructor(private shoppingListService:ShoppingListService){

  }

  onAddItem(){
    let name:string=this.nameRef.nativeElement.value;
    let amount:number=this.amountRef.nativeElement.value;
    let ingredient=new Ingredient(name,amount);
    this.shoppingListService.addIngredient(ingredient);
    return false;
  }

}
