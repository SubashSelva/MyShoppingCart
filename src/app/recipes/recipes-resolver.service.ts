import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Recipe } from "./recipe.model";

@Injectable({providedIn:'root'})

export class RecipesResolverService implements Resolve<Recipe[]>{

    constructor()

}