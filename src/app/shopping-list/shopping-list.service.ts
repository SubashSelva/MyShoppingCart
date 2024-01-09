import { EventEmitter, Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ShoppingListService{

    ingredientChanged = new Subject<Ingredient[]>();

    private ingredients:Ingredient[] = [
        new Ingredient('Apple',5),
        new Ingredient('Tomatoes',10),
    ];

    getIngredients(){
       return this.ingredients.slice();
    }

    addIngredient(ingredient:Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientChanged.next(this.ingredients);
    }
    addIngredients(ingredients:Ingredient[]){
        this.ingredients.push(...ingredients);
        this.ingredientChanged.next(this.ingredients);
    }
}