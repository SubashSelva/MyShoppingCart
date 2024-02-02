import { EventEmitter, Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ShoppingListService {

    ingredientChanged = new Subject<Ingredient[]>();
    ingredientStartedEditing = new Subject<number>();

    private ingredients: Ingredient[] = [];

    getIngredients() {
        return this.ingredients.slice();
    }
    getIngredient(index: number) {
        return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientChanged.next(this.ingredients);
    }
    addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.ingredientChanged.next(this.ingredients);
    }
    updateIngredient(index: number, ingredient: Ingredient) {
        this.ingredients[index] = ingredient;
        this.ingredientChanged.next(this.ingredients);
    }
    reloadIngredients(ingredients: Ingredient[]) {
        this.ingredients = ingredients;
        this.ingredientChanged.next(this.ingredients);
    }
    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1);
        this.ingredientChanged.next(this.ingredients);
    }
}