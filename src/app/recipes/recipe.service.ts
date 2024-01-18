import { EventEmitter, Injectable, inject } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { DataStorageService } from "../shared/data-storage.service";

@Injectable({
    providedIn: 'root'
})

export class RecipeService {

    recipesUpdated=new Subject<Recipe[]>();

    constructor(private shoppingListService:ShoppingListService){
    }

    // private recipes:Recipe[]=[
    //     new Recipe(
    //         1,
    //         'A test Recipe',
    //         'This is simply a test',
    //         'https://static.toiimg.com/thumb/103173028.cms?width=573&height=430',
    //         [
    //             new Ingredient("Meat",1),
    //             new Ingredient("French Fries",20),
    //         ]),
    //     new Recipe(
    //         2,
    //         'A test Recipe 2',
    //         'This is simply a test 2',
    //         'https://static.toiimg.com/thumb/103173028.cms?width=573&height=430',
    //         [
    //             new Ingredient("Meat",1),
    //             new Ingredient("Buns",5),
    //         ])
    //   ];
    
    private recipes:Recipe[]=[];

    addRecipe(recipe:Recipe){
        this.recipes.push(recipe);
        this.recipesUpdated.next(this.recipes.slice());
    }

    updateRecipe(recipe:Recipe){
        this.recipes.filter(r=>r.id==recipe.id).forEach(existingrecipe=>{
            existingrecipe.name=recipe.name;
            existingrecipe.imagePath=recipe.imagePath;
            existingrecipe.description=recipe.description;
            existingrecipe.ingredients=recipe.ingredients;
            return;
        })
        this.recipesUpdated.next(this.recipes.slice());
    }
    deleteRecipe(recipeId:number){
        let index=this.recipes.findIndex(r=>r.id==recipeId);
        this.recipes.splice(index,1);
        this.recipesUpdated.next(this.recipes.slice());
    }

    getRecipes(){
       return this.recipes.slice();
    }

    getRecipesById(id:number){
        return this.recipes.find(i=>i.id==id);
    }

    reloadRecipes(recipes:Recipe[]){
        this.recipes=recipes;
        this.recipesUpdated.next(this.recipes.slice());
    }

    addIngredientToShoppingList(ingredients:Ingredient[]){
        this.shoppingListService.addIngredients(ingredients);
    }
}
export const RetriveRecipesResolver: ResolveFn<any> =
        (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

            let recipes = inject(RecipeService).getRecipes();
            if (recipes.length == 0)
                return inject(DataStorageService).retreiveRecipes();
            else
                return recipes;
    };