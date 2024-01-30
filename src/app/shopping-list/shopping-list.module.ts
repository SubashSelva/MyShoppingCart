import { NgModule } from "@angular/core";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { RouterModule, Routes } from "@angular/router";
import { ShoppingListService } from "./shopping-list.service";
import { SharedModule } from "../shared/shared.module";


const appRoutes: Routes = [
    { path: '', component: ShoppingListComponent },
]

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent
    ],
    imports: [SharedModule,RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})


export class ShoppingListModule {

}