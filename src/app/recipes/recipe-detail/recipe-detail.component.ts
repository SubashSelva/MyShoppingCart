import { Component, OnInit} from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe:Recipe;

  constructor(private recipeService:RecipeService, private route:ActivatedRoute){

  }
  ngOnInit(): void {
    this.route.params.subscribe((param:Params)=>{
        let recipeId = +param["id"];
        this.recipe=this.recipeService.getRecipesById(recipeId);
    })
  }

  onAddToShoppingList(){
    this.recipeService.addIngredientToShoppingList(this.recipe.ingredients)
  }
}
