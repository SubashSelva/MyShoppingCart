import { EventEmitter, Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";

@Injectable({
    providedIn: 'root'
})

export class RecipeService {

    constructor(private shoppingListService:ShoppingListService){
    }

    private recipes:Recipe[]=[
        new Recipe(
            1,
            'A test Recipe',
            'This is simply a test',
            'https://static.toiimg.com/thumb/103173028.cms?width=573&height=430',
            [
                new Ingredient("Meat",1),
                new Ingredient("French Fries",20),
            ]),
        new Recipe(
            2,
            'A test Recipe 2',
            'This is simply a test 2',
            'https://static.toiimg.com/thumb/103173028.cms?width=573&height=430',
            [
                new Ingredient("Meat",1),
                new Ingredient("Buns",5),
            ])
      ];

    getRecipes(){
       return this.recipes.slice();
    }

    getRecipesById(id:number){
        return this.recipes.find(i=>i.id===id);
    }
    addIngredientToShoppingList(ingredients:Ingredient[]){
        this.shoppingListService.addIngredients(ingredients);
    }
}