import { NgModule } from "@angular/core";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeItemComponent } from "./recipe-list/recipe-item/recipe-item.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipesComponent } from "./recipes.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardActivation } from "../auth/auth.service";
import { RecipeService, RetriveRecipesResolver } from "./recipe.service";
import { SharedModule } from "../shared/shared.module";


const appRoutes: Routes = [
    {
        path: '',
        component: RecipesComponent,
        canActivate:[AuthGuardActivation],
        children: [
            { path: '', component: RecipeStartComponent, pathMatch: "full" },
            { path: 'recipe-list', component: RecipeListComponent },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipeDetailComponent, resolve: { data: RetriveRecipesResolver } },
            { path: ':id/edit', component: RecipeEditComponent, resolve: { data: () => RetriveRecipesResolver } },
        ]
    },
    //{ path: '**', component:AuthComponent, canActivate:[AuthGuardActivation]}
]


@NgModule({
    declarations: [
        RecipesComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        RecipeListComponent,
        RecipeStartComponent,
        RecipeEditComponent,
    ],
    imports: [SharedModule, RouterModule.forChild(appRoutes)],
    exports:[RouterModule,SharedModule]
})

export class RecipeModule {

}