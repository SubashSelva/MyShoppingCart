import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { RecipeStartComponent } from "./recipes/recipe-start/recipe-start.component";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeListComponent } from "./recipes/recipe-list/recipe-list.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";

const appRoutes:Routes=[
    {path:'',component:RecipesComponent, pathMatch:"full"},
    {path:'recipes',component:RecipesComponent, children:[
        {path:'',component:RecipeStartComponent, pathMatch:"full"},
        {path:'recipe-list',component:RecipeListComponent},
        {path:'new',component:RecipeEditComponent},
        {path:':id',component:RecipeDetailComponent},
        {path:':id/edit',component:RecipeEditComponent},
    ]},
    {path:'shopping-list',component:ShoppingListComponent},
    {path:'**',component:RecipesComponent},
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports:[RouterModule]
})

export class AppRoutingModule{

}