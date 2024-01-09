import { Component, ElementRef,OnDestroy,OnInit,ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { FormControl, NgForm } from '@angular/forms';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy { 
  itemEditMode:boolean=false;
  editedItemIndex:number;
  editedItem:Ingredient;
  @ViewChild('shoppingEditForm') shoppingEditForm :NgForm;
  
  constructor(private shoppingListService:ShoppingListService){

  }

  ngOnInit(): void {
    this.shoppingListService.ingredientStartedEditing.subscribe
    ((itemIndex:number)=>{
      this.itemEditMode=true;
      this.editedItemIndex=itemIndex;
      this.editedItem=this.shoppingListService.getIngredient(this.editedItemIndex);
      this.shoppingEditForm.setValue({
        name:this.editedItem.name,
        amount:this.editedItem.amount
      })
    });
  }

  onSubmitForm(shoppingEditForm:NgForm){
    let formData=shoppingEditForm.value;
    let ingredient=new Ingredient(formData.name,formData.amount);
    if(this.itemEditMode)
        this.shoppingListService.updateIngredient(this.editedItemIndex,ingredient);
    else
      this.shoppingListService.addIngredient(ingredient);

    this.itemEditMode=false;
    this.shoppingEditForm.reset();
  }

  onClearItem(){
    this.shoppingEditForm.reset();
    this.itemEditMode=false;
  }

  onDeleteItem(){
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.itemEditMode=false;
    this.shoppingEditForm.reset();
  }

  ngOnDestroy(): void {
    this.shoppingListService.ingredientStartedEditing.unsubscribe();
  }
}
