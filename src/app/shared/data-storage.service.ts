import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { environment } from "src/environments/environment.development";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { ShoppingItem } from "./shoppingItem.model";


@Injectable({ providedIn: 'root' })

export class DataStorageService {

    constructor(private httpClient: HttpClient,
        private recipeService: RecipeService, private shoppingListService: ShoppingListService) {

    }

    storeItems() {
        const recipes = this.recipeService.getRecipes();
        const ingredients = this.shoppingListService.getIngredients();
        const reqObj = new ShoppingItem(recipes, ingredients);

        return this.httpClient.put
            (environment.fireBaseDatabaseBaseURL + 'shoppingItems.json',
                reqObj);
    }

    retriveItems() {
        return this.httpClient.get<ShoppingItem>
            (environment.fireBaseDatabaseBaseURL + 'shoppingItems.json')
            .pipe(
                map(resObj => {
                    if (!resObj)
                        return new ShoppingItem([], [])

                    const recipes = resObj.recipes.map(resObj => {
                        return { ...resObj, ingredients: resObj.ingredients ? resObj.ingredients : [] }
                    });
                    const ingredients = resObj.ingredients;

                    return new ShoppingItem(recipes, ingredients);
                }),
                tap(resObj => {
                    if (resObj) {
                        this.recipeService.reloadRecipes(resObj.recipes);
                        this.shoppingListService.reloadIngredients(resObj.ingredients);
                    }
                })
            );
    }


    // storeRecipes() {
    //     var recipes = this.recipeService.getRecipes();
    //     return this.httpClient.put
    //         (environment.fireBaseDatabaseBaseURL + 'recipes.json',
    //             recipes);
    // }

    // retreiveRecipes() {
    //     return this.httpClient.get<Recipe[]>
    //         (environment.fireBaseDatabaseBaseURL + 'recipes.json')
    //         .pipe(
    //             map(resObj => {
    //                 return resObj.map(resObj => {
    //                     return { ...resObj, ingredients: resObj.ingredients ? resObj.ingredients : [] }
    //                 })
    //             }),
    //             tap(resObj => {
    //                 this.recipeService.reloadRecipes(resObj);
    //             })
    //         );
    // }
}