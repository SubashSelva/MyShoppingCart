import { Component} from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
  recipes:Recipe[];

  constructor(private recipeService:RecipeService, 
    private router:Router, private route:ActivatedRoute){

  }
  ngOnInit(){
    this.recipes=this.recipeService.getRecipes();
  }
  
  onAddNewRecipe(){
      this.router.navigate(['new'],{relativeTo:this.route});
  }
}
