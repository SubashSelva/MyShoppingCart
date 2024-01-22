import { NgModule, inject } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { RecipeStartComponent } from "./recipes/recipe-start/recipe-start.component";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeListComponent } from "./recipes/recipe-list/recipe-list.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { DataStorageService } from "./shared/data-storage.service";
import { RetriveRecipesResolver } from "./recipes/recipe.service";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuardActivation } from "./auth/auth.service";

const appRoutes: Routes = [
    { path: '', component: RecipesComponent, canActivate:[AuthGuardActivation], pathMatch: "full" },
    {
        path: 'recipes',
        component: RecipesComponent,
        canActivate:[AuthGuardActivation],
        children: [
            { path: '', component: RecipeStartComponent, pathMatch: "full" },
            { path: 'recipe-list', component: RecipeListComponent },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipeDetailComponent, resolve: { data: RetriveRecipesResolver } },
            // { path: ':id/edit', component: RecipeEditComponent, resolve: { data: () => inject(DataStorageService).retreiveRecipes() } },
            { path: ':id/edit', component: RecipeEditComponent, resolve: { data: () => RetriveRecipesResolver } },
        ]
    },
    { path: 'shopping-list', component: ShoppingListComponent },
    { path: 'auth', component: AuthComponent },
    { path: '**', component: RecipesComponent, canActivate:[AuthGuardActivation], },
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
