import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  recipeId:number; 
  editMode=false;
  recipeForm:FormGroup;
  recipe:Recipe;


  constructor(private route:ActivatedRoute, private recipeService:RecipeService,
    private router:Router){
  }

  ngOnInit(): void {
    this.route.params.subscribe((param:Params)=>{
      let id = param["id"];
      if(id==null || id==undefined)
        this.editMode=false;
      else{
        this.editMode=true;
        this.recipeId=id;
      }
      this.initForm()
    })
  }

  private initForm(){
    let recipeName='';
    let recipeImgPath='';
    let recipeDescription='';
    let recipeIngredients = new FormArray([]);

    if(this.editMode){
      this.recipe = this.recipeService.getRecipesById(this.recipeId);
      recipeName=this.recipe.name;
      recipeImgPath=this.recipe.imagePath;
      recipeDescription= this.recipe.description;
      if(this.recipe.ingredients){
        this.recipe.ingredients.forEach(ingredient=>
          {
            recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount,[
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ]),
            }));
          });
      }
    }

    this.recipeForm = new FormGroup({
      'name':new FormControl(recipeName, Validators.required),
      'imagePath':new FormControl(recipeImgPath, Validators.required),
      'description':new FormControl(recipeDescription, Validators.required),
      'ingredients':recipeIngredients
    });
  }

  onSubmit(){
    let recipe=this.recipeForm.value;
    if(this.editMode){
      recipe.id=this.recipeId;
      this.recipeService.updateRecipe(recipe);
    }
    else{
      let newRecipeId=this.recipeService.getRecipes().length + 1;
      recipe.id=newRecipeId;
      this.recipeService.addRecipe(recipe);
    }

    this.onCancel();
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name':new FormControl(null,Validators.required),
        'amount':new FormControl(null,[
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ]),
      })
    )
  }

  onDeleteIngredient(index:number){
    (<FormArray>this.recipeForm.get('ingredients').value).removeAt(index);
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo:this.route})
  }
}
