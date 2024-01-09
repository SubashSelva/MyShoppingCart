import { Component, OnDestroy, OnInit} from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent  implements OnInit,OnDestroy{
  recipes:Recipe[];
  subscription:Subscription;

  constructor(private recipeService:RecipeService, 
    private router:Router, private route:ActivatedRoute){

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(){
    this.recipes=this.recipeService.getRecipes();

    this.subscription=this.recipeService.recipesUpdated.subscribe((recipes:Recipe[])=>{
      this.recipes=recipes;
    })
  }
  
  onAddNewRecipe(){
      this.router.navigate(['new'],{relativeTo:this.route});
  }
}
