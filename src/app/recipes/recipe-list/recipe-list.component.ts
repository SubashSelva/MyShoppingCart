import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;
  initSubscription: Subscription;

  constructor(private recipeService: RecipeService,
    private router: Router, private route: ActivatedRoute, private dataservice: DataStorageService) {

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.initSubscription.unsubscribe();
  }
  ngOnInit() {
    this.recipes = this.recipeService.getRecipes();
    console.log("this.recipes.length", this.recipes.length);
    if (this.recipes.length == 0) {
      this.initSubscription = this.dataservice.retreiveRecipes().subscribe((recipes: Recipe[]) => {
        console.log("Initial Obervable triggered!")
        this.recipes = recipes;
      });
    }
    this.subscription = this.recipeService.recipesUpdated.subscribe((recipes: Recipe[]) => {
      console.log("Obervable triggered!")
      this.recipes = recipes;
    })
  }

  onAddNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
