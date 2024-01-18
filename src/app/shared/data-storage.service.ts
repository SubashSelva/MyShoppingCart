import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { map, tap } from "rxjs/operators";


@Injectable({providedIn:'root'})

export class DataStorageService{

    constructor(private httpClient:HttpClient, private recipeService:RecipeService){

    }

    storeRecipes(){
        var recipes=this.recipeService.getRecipes();
        return this.httpClient.put("https://recipe-book-1f02c-default-rtdb.firebaseio.com/recipes.json",recipes);
    }

    retreiveRecipes(){
        return this.httpClient.get<Recipe[]>
        ('https://recipe-book-1f02c-default-rtdb.firebaseio.com/recipes.json')
        .pipe(
            map(resObj=>{
            return resObj.map(resObj=>{
                return {...resObj,ingredients:resObj.ingredients?resObj.ingredients:[]}
            })
        }),
        tap(resObj=>{
            this.recipeService.reloadRecipes(resObj);
        }));
    }
}