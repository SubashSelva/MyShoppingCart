import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { environment } from "src/environments/environment.development";


@Injectable({ providedIn: 'root' })

export class DataStorageService {

    constructor(private httpClient: HttpClient,
        private recipeService: RecipeService, private authService: AuthService) {

    }

    storeRecipes() {
        var recipes = this.recipeService.getRecipes();
        return this.httpClient.put
            (environment.fireBaseDatabaseBaseURL + 'recipes.json',
                recipes);
    }

    retreiveRecipes() {
        return this.httpClient.get<Recipe[]>
            (environment.fireBaseDatabaseBaseURL + 'recipes.json')
            .pipe(
                map(resObj => {
                    return resObj.map(resObj => {
                        return { ...resObj, ingredients: resObj.ingredients ? resObj.ingredients : [] }
                    })
                }),
                tap(resObj => {
                    this.recipeService.reloadRecipes(resObj);
                })
            );
    }
}