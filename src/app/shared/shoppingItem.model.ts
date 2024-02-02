import { Recipe } from "../recipes/recipe.model";
import { Ingredient } from "./ingredient.model";

export class ShoppingItem {

    constructor(public recipes: Recipe[], public ingredients: Ingredient[]) {

    }
}