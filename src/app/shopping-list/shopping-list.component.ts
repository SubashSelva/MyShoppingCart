import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],

})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients:Ingredient[];
  ingredientChangedObservable:Subscription;

  constructor(private shoppingListService:ShoppingListService){

  }
  ngOnDestroy(): void {
    this.ingredientChangedObservable.unsubscribe();
  }
  ngOnInit(): void {
    this.ingredients=this.shoppingListService.getIngredients();

    this.ingredientChangedObservable= this.shoppingListService.ingredientChanged.subscribe((ingredients:Ingredient[])=>{
      this.ingredients=ingredients;
    })
  }

 onAddItem(ingredient:Ingredient){
  this.ingredients.push(ingredient);
 }

}
